import { getTranslations } from "next-intl/server";
import { FileCommentHeader } from "@/components/file-comment-header";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { ProjectCard, Project } from "@/components/project-card";

export default async function Projects() {
  const t = await getTranslations("projects");
  const tCommon = await getTranslations("common");

  const projects: Project[] = [
    {
      id: 'ultimate-tic-tac-toe',
      name: t('ultimateTicTacToe.name'),
      description: t('ultimateTicTacToe.description'),
      technologies: ['Next.js', 'React', 'TypeScript', 'Fastify', 'TailwindCSS', 'shadcn/ui', 'next-intl', 'Turbo Repo'],
      status: 'completed',
      githubUrl: 'https://github.com/TSmota/ultimate-tic-tac-toe',
      liveUrl: 'https://tic-tac-toe.thiagoms.dev/',
      images: ['/images/tic-tac-toe.png']
    },
    {
      id: 'bytebank',
      name: t('bytebank.name'),
      description: t('bytebank.description'),
      technologies: ['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'Supabase', 'PostgreSQL', 'Storybook', 'Turbo Repo', 'Docker'],
      status: 'inProgress',
      githubUrl: 'https://github.com/thegfmachado/fiap-tech-challenge',
      liveUrl: 'https://fiap-tech-challenge-bytebank-web.vercel.app/',
      images: ['/images/bytebank-home.png', '/images/bytebank-login.png', '/images/bytebank-dashboard.png']
    },
    {
      id: 'portfolio',
      name: t('portfolio.name'),
      description: t('portfolio.description'),
      technologies: ['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'shadcn/ui', 'next-intl'],
      status: 'completed',
      githubUrl: 'https://github.com/TSmota/portfolio',
    }
  ];

  return (
    <main className="h-full bg-background text-foreground overflow-auto">
      <div className="flex-1 p-4 sm:p-6">
          <FileCommentHeader filename="projects.json" />
          
          <PageHeader title={t('title')} subtitle={t('subtitle')} />

          {/* Projects Statistics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <StatCard 
              value={projects.length} 
              label={tCommon('ui.totalProjects')} 
            />
            <StatCard 
              value={projects.filter(p => p.status === 'completed').length} 
              label={tCommon('status.completed')} 
              color="text-green-500"
            />
            <StatCard 
              value={projects.filter(p => p.status === 'inProgress').length} 
              label={tCommon('status.inProgress')} 
              color="text-yellow-500"
            />
            <StatCard 
              value={projects.filter(p => p.status === 'planned').length} 
              label={tCommon('status.planned')} 
              color="text-blue-500"
            />
          </div>
          
          {/* Projects Grid */}
          <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
      </div>
    </main>
  );
}
