#!/usr/bin/env node

/**
 * scripts/sync-projects.mjs
 *
 * Syncs portfolio projects from GitHub repositories.
 *
 * 1. Reads extra repos from scripts/extra-repos.yml
 * 2. Lists the configured user's repos and reads each .portfolio.yml
 * 3. Downloads project images from repos
 * 4. Validates everything, then writes public/images/, messages/*.json
 *    and src/data/projects.json
 */

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

// ─── Configuration ───────────────────────────────────────────────────────────

const ROOT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
const EXTRA_REPOS_PATH = join(ROOT_DIR, 'scripts', 'extra-repos.yml');
const PROJECTS_JSON_PATH = join(ROOT_DIR, 'src', 'data', 'projects.json');
const PUBLIC_IMAGES_DIR = join(ROOT_DIR, 'public', 'images');
const getMessagesPath = (locale) => join(ROOT_DIR, 'messages', `${locale}.json`);

const GITHUB_API = 'https://api.github.com';
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || 'TSmota';
const GITHUB_HEADERS = {
  'User-Agent': 'portfolio-sync',
  ...(process.env.GH_TOKEN && { Authorization: `Bearer ${process.env.GH_TOKEN}` }),
};
const REQUEST_TIMEOUT_MS = 30_000;
// Kept low to stay clear of GitHub's secondary rate limits.
const MAX_CONCURRENT_REPOS = 5;
const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

const LOCALES = ['en', 'pt'];
const REQUIRED_TRANSLATION_FIELDS = ['name', 'description'];
const PROJECT_STATUSES = new Set(['completed', 'inProgress', 'planned']);
const RESERVED_PROJECT_IDS = new Set(['title', 'subtitle']);
const DEFAULT_ORDER = 999;
const DEFAULT_STATUS = 'completed';

const PROJECT_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const PATH_SEGMENT_PATTERN = /^[A-Za-z0-9_.-]+$/;
const IMAGE_NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

const IMAGE_FORMAT_BY_EXTENSION = new Map([
  ['png', 'png'],
  ['jpg', 'jpeg'],
  ['jpeg', 'jpeg'],
  ['gif', 'gif'],
  ['webp', 'webp'],
  ['avif', 'avif'],
]);

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const AVIF_BRANDS = new Set(['avif', 'avis']);

const IMAGE_SIGNATURE_CHECKS = {
  png: (data) => data.subarray(0, 8).equals(PNG_SIGNATURE),
  jpeg: (data) => data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff,
  gif: (data) => ['GIF87a', 'GIF89a'].includes(data.toString('ascii', 0, 6)),
  webp: (data) => data.toString('ascii', 0, 4) === 'RIFF' && data.toString('ascii', 8, 12) === 'WEBP',
  avif: (data) => {
    if (data.toString('ascii', 4, 8) !== 'ftyp') return false;
    // Major brand at offset 8; compatible brands start at offset 16.
    const offsets = [8];
    for (let offset = 16; offset + 4 <= Math.min(data.length, 64); offset += 4) offsets.push(offset);
    return offsets.some((offset) => AVIF_BRANDS.has(data.toString('ascii', offset, offset + 4)));
  },
};

// ─── Utilities ───────────────────────────────────────────────────────────────

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

const isPlainObject = (value) =>
  value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date);

const isNonEmptyString = (value) => typeof value === 'string' && value.trim() !== '';

const isSafePathSegment = (value) =>
  typeof value === 'string' && PATH_SEGMENT_PATTERN.test(value) && value !== '.' && value !== '..';

const getImageFormat = (filename) =>
  IMAGE_FORMAT_BY_EXTENSION.get(filename.split('.').pop().toLowerCase());

const displayPath = (path) => relative(ROOT_DIR, path);

const readJSON = (path) => JSON.parse(readFileSync(path, 'utf-8'));

function writeFile(path, data) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, data);
}

const writeJSON = (path, value) => writeFile(path, `${JSON.stringify(value, null, 2)}\n`);

/** Like `Promise.all(items.map(mapper))`, but with at most `limit` mappers in flight. */
async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;

  const worker = async () => {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await mapper(items[index]);
    }
  };

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

// ─── Validation ──────────────────────────────────────────────────────────────

function parseLiveUrl(value, source) {
  if (value == null) return undefined;

  ensure(typeof value === 'string' && URL.canParse(value), `Invalid project liveUrl in ${source}: ${value}`);
  ensure(
    ['http:', 'https:'].includes(new URL(value).protocol),
    `Project liveUrl must use HTTP or HTTPS in ${source}.`
  );
  return value;
}

function parseImages(images, source) {
  if (images == null) return [];
  ensure(Array.isArray(images), `Project images must be an array in ${source}.`);

  const seenNames = new Set();
  return images.map((image) => {
    const name = image?.name;
    ensure(
      typeof name === 'string' && IMAGE_NAME_PATTERN.test(name),
      `Unsafe or missing image filename in ${source}: ${name}`
    );
    ensure(!seenNames.has(name), `Duplicate image filename in ${source}: ${name}`);
    seenNames.add(name);

    if (image.source == null) return { name };

    const format = getImageFormat(name);
    ensure(
      format &&
        typeof image.source === 'string' &&
        image.source.split('/').every(isSafePathSegment) &&
        getImageFormat(image.source) === format,
      `Invalid image source path or format in ${source}: ${image.source}`
    );
    return { name, source: image.source, format };
  });
}

/** Splits a raw project config into public project data, translations and image specs. */
function normalizeProject(config, { owner, repo, source }) {
  ensure(isPlainObject(config), `Invalid project configuration in ${source}.`);

  const { id } = config;
  const order = config.order ?? DEFAULT_ORDER;
  const status = config.status ?? DEFAULT_STATUS;
  const technologies = config.technologies ?? [];
  const i18n = config.i18n ?? {};

  ensure(
    typeof id === 'string' && PROJECT_ID_PATTERN.test(id) && !RESERVED_PROJECT_IDS.has(id),
    `Invalid or reserved project id in ${source}: ${id}`
  );
  ensure(Number.isFinite(order), `Project order must be a finite number in ${source}.`);
  ensure(PROJECT_STATUSES.has(status), `Invalid project status in ${source}: ${status}`);
  ensure(
    Array.isArray(technologies) && technologies.every(isNonEmptyString),
    `Project technologies must be non-empty strings in ${source}.`
  );
  ensure(isPlainObject(i18n), `Project translations must be an object in ${source}.`);
  const liveUrl = parseLiveUrl(config.liveUrl, source);

  return {
    project: {
      id,
      order,
      status,
      technologies,
      githubUrl: `https://github.com/${owner}/${repo}`,
      ...(liveUrl && { liveUrl }),
    },
    i18n,
    images: parseImages(config.images, source),
  };
}

// ─── GitHub API ──────────────────────────────────────────────────────────────

async function githubRequest(path, { accept = 'application/vnd.github+json', optional = false } = {}) {
  const url = `${GITHUB_API}${path}`;
  const res = await fetch(url, {
    headers: { ...GITHUB_HEADERS, Accept: accept },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (optional && res.status === 404) return null;
  ensure(res.ok, `GitHub request failed (${res.status} ${res.statusText}): ${url}`);
  return res;
}

async function fetchOwnedRepos() {
  const repos = [];

  for (let page = 1; ; page++) {
    const res = await githubRequest(
      `/users/${encodeURIComponent(GITHUB_USERNAME)}/repos?type=owner&per_page=100&page=${page}`
    );
    const batch = await res.json();
    ensure(Array.isArray(batch), `Expected a repository list from GitHub for ${GITHUB_USERNAME}.`);

    repos.push(...batch);
    if (batch.length < 100) return repos;
  }
}

/** Fetches a file from the repo's default branch as raw bytes (no base64, no extra branch lookup). */
function fetchRepoFile(owner, repo, filePath, { optional = false } = {}) {
  const encodedPath = filePath.split('/').map(encodeURIComponent).join('/');
  return githubRequest(`/repos/${owner}/${repo}/contents/${encodedPath}`, {
    accept: 'application/vnd.github.raw+json',
    optional,
  });
}

async function readBodyWithLimit(res, maxBytes, label) {
  const tooLargeMessage = `${label} exceeds the ${maxBytes} byte limit.`;
  ensure(Number(res.headers.get('content-length') ?? 0) <= maxBytes, tooLargeMessage);
  ensure(res.body, `${label} returned an empty response.`);

  const chunks = [];
  let size = 0;
  for await (const chunk of res.body) {
    size += chunk.byteLength;
    ensure(size <= maxBytes, tooLargeMessage);
    chunks.push(chunk);
  }
  return Buffer.concat(chunks, size);
}

async function fetchPortfolioConfig(owner, repo) {
  const res = await fetchRepoFile(owner, repo, '.portfolio.yml', { optional: true });
  if (!res) return null;
  return yaml.load(await res.text())?.portfolio || null;
}

// ─── Config loaders ──────────────────────────────────────────────────────────

function parseExtraRepo(config) {
  ensure(
    isPlainObject(config) && typeof config.repo === 'string',
    'Each extra repository must define "repo" as owner/name.'
  );
  const [owner, repo, ...rest] = config.repo.split('/');
  ensure(rest.length === 0, `Invalid extra repository name: ${config.repo}`);
  return { owner, repo, fallbackConfig: config };
}

function loadExtraRepos() {
  if (!existsSync(EXTRA_REPOS_PATH)) return [];

  const data = yaml.load(readFileSync(EXTRA_REPOS_PATH, 'utf-8'));
  if (data == null) return [];
  ensure(Array.isArray(data.projects), `${displayPath(EXTRA_REPOS_PATH)} must contain a projects array.`);
  return data.projects.map(parseExtraRepo);
}

// ─── Images ──────────────────────────────────────────────────────────────────

async function downloadImage(owner, repo, { name, source, format }) {
  const label = `${owner}/${repo}/${source}`;
  console.log(`    📥 Downloading: ${label} → ${name}`);

  const res = await fetchRepoFile(owner, repo, source);
  const data = await readBodyWithLimit(res, MAX_IMAGE_BYTES, label);
  ensure(IMAGE_SIGNATURE_CHECKS[format](data), `Downloaded content is not a valid ${format} image: ${label}`);

  return {
    publicPath: `/images/${owner}/${repo}/${name}`,
    file: { path: join(PUBLIC_IMAGES_DIR, owner, repo, name), data },
  };
}

function resolveLocalImage({ name }) {
  const isFile = statSync(join(PUBLIC_IMAGES_DIR, name), { throwIfNoEntry: false })?.isFile();
  ensure(isFile, `Local image does not exist: public/images/${name}`);
  return { publicPath: `/images/${name}` };
}

const resolveImage = (owner, repo, image) =>
  image.source ? downloadImage(owner, repo, image) : resolveLocalImage(image);

// ─── Repo sync ───────────────────────────────────────────────────────────────

/** Resolves a repo into `{ project, i18n, files }`, or `null` when it has no portfolio config. */
async function syncRepo({ owner, repo, fallbackConfig }) {
  const fullName = `${owner}/${repo}`;
  ensure(isSafePathSegment(owner) && isSafePathSegment(repo), `Invalid repository name: ${fullName}`);

  // The repo's own .portfolio.yml takes precedence over inline extra-repos.yml config.
  const remoteConfig = await fetchPortfolioConfig(owner, repo);
  const config = remoteConfig ?? fallbackConfig;
  if (!config) {
    console.log(`  ⏭️  ${fullName}: no portfolio config, skipping.`);
    return null;
  }

  const origin = remoteConfig ? '.portfolio.yml' : displayPath(EXTRA_REPOS_PATH);
  console.log(`  ✅ ${fullName}: using ${origin}`);

  const { project, i18n, images } = normalizeProject(config, {
    owner,
    repo,
    source: `${origin} (${fullName})`,
  });
  const resolvedImages = await Promise.all(images.map((image) => resolveImage(owner, repo, image)));

  return {
    project: {
      ...project,
      ...(resolvedImages.length > 0 && { images: resolvedImages.map((image) => image.publicPath) }),
    },
    i18n,
    files: resolvedImages.flatMap((image) => image.file ?? []),
  };
}

function indexById(entries, origin) {
  const byId = new Map();
  for (const entry of entries) {
    if (!entry) continue;
    const { id } = entry.project;
    ensure(!byId.has(id), `Duplicate project id "${id}" in ${origin}.`);
    byId.set(id, entry);
  }
  return byId;
}

/** Combines owned and extra projects; extra-repos.yml wins on id conflicts. */
function mergeEntries(ownedEntries, extraEntries) {
  const merged = indexById(ownedEntries, 'owned repositories');
  for (const [id, entry] of indexById(extraEntries, displayPath(EXTRA_REPOS_PATH))) {
    if (merged.has(id)) console.warn(`  ⚠️  Duplicate id "${id}" — extra-repos.yml takes precedence.`);
    merged.set(id, entry);
  }
  return [...merged.values()];
}

// ─── Output ──────────────────────────────────────────────────────────────────

/** Builds updated message files, failing if any project lacks a required translation. */
function buildMessageFiles(entries) {
  return LOCALES.map((locale) => {
    const path = getMessagesPath(locale);
    const messages = readJSON(path);
    const existing = messages.projects ?? {};
    ensure(isPlainObject(existing), `Invalid projects translations in ${displayPath(path)}.`);

    const translations = { ...existing };
    for (const { project, i18n } of entries) {
      const incoming = i18n[locale] ?? {};
      ensure(isPlainObject(incoming), `Invalid ${locale} translation for project "${project.id}".`);

      const translation = { ...translations[project.id], ...incoming };
      for (const field of REQUIRED_TRANSLATION_FIELDS) {
        ensure(
          isNonEmptyString(translation[field]),
          `Missing required ${field} for project "${project.id}" in locale "${locale}".`
        );
      }
      translations[project.id] = translation;
    }

    return { path, data: { ...messages, projects: translations } };
  });
}

function writeOutputs(entries, messageFiles) {
  for (const { path, data } of entries.flatMap((entry) => entry.files)) {
    writeFile(path, data);
  }

  for (const { path, data } of messageFiles) {
    writeJSON(path, data);
    console.log(`✅ Updated ${displayPath(path)}`);
  }

  writeJSON(PROJECTS_JSON_PATH, entries.map((entry) => entry.project));
  console.log(`✅ Generated ${displayPath(PROJECTS_JSON_PATH)} (${entries.length} projects)`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔄 Starting portfolio project sync...\n');

  const extraTargets = loadExtraRepos();

  console.log(`📡 Fetching repos for ${GITHUB_USERNAME}...`);
  const ownedTargets = (await fetchOwnedRepos()).map((repo) => ({ owner: repo.owner.login, repo: repo.name }));
  console.log(`   Found ${ownedTargets.length} owned and ${extraTargets.length} extra repo(s).\n`);

  console.log('🔍 Scanning repos...');
  const results = await mapWithConcurrency(
    [...ownedTargets, ...extraTargets],
    MAX_CONCURRENT_REPOS,
    syncRepo
  );
  const entries = mergeEntries(
    results.slice(0, ownedTargets.length),
    results.slice(ownedTargets.length)
  ).sort((a, b) => a.project.order - b.project.order);

  console.log(`\n📊 Total projects collected: ${entries.length}`);
  if (entries.length === 0) {
    console.log('⚠️  No projects found. Skipping generation.');
    return;
  }

  // Everything is validated before the first write, so a failed sync leaves no partial output.
  const messageFiles = buildMessageFiles(entries);
  writeOutputs(entries, messageFiles);

  console.log('\n🎉 Sync complete!');
}

main().catch((error) => {
  console.error('❌ Sync failed:', error);
  process.exit(1);
});
