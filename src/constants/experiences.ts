export const skills = {
  languages: [
    { name: 'TypeScript' },
    { name: 'JavaScript' },
    { name: 'NodeJS' },
    { name: 'HTML' },
    { name: 'CSS' },
  ],
  frameworks: [
    { name: 'React' },
    { name: 'NextJS' },
    { name: 'TailwindCSS' },
    { name: 'Express' },
    { name: 'Fastify' },
  ],
  databases: [
    { name: 'PostgreSQL' },
    { name: 'Prisma' },
    { name: 'Drizzle ORM' },
    { name: 'Supabase' },
  ],
  tools: [
    { name: 'Docker' },
    { name: 'Git' },
    { name: 'GitHub' },
    { name: 'GitHub Actions' },
    { name: 'Vercel' },
    { name: 'Vitest' },
    { name: 'Playwright' },
    { name: 'Jest' },
    { name: 'ESLint' },
    { name: 'Storybook' },
  ],
} as const;

export const experiences = {
  'philips': {
    company: 'Philips',
    positions: [
      {
        id: 'senior-software-developer',
        technologies: ['TypeScript', 'JavaScript', 'NodeJS', 'HTML', 'CSS', 'React', 'Git', 'GitHub', 'Prisma', 'PostgreSQL', 'Docker', 'Vitest', 'Playwright', 'Jest']
      }
    ]
  },
  'class-solutions': {
    company: 'Class Solutions',
    positions: [
      {
        id: 'frontend-developer',
        technologies: ['TypeScript', 'JavaScript', 'NodeJS', 'HTML', 'CSS', 'React', 'Git', 'AngularJS']
      },
      {
        id: 'frontend-intern',
        technologies: ['JavaScript', 'HTML', 'CSS', 'React', 'Git', 'AngularJS']
      }
    ]
  },
} as const;

export const educations = {
  'fiap': {
    id: 'fiap',
    status: 'inProgress'
  },
  'mackenzie': {
    id: 'mackenzie',
    status: 'completed'
  },
} as const;

export type Skills = typeof skills[keyof typeof skills];

export type Experience = typeof experiences[keyof typeof experiences];
export type Companies = Experience['company'];
export type Position = Experience['positions'][number];
export type PositionId = Position['id'];

export type Education = typeof educations[keyof typeof educations];
