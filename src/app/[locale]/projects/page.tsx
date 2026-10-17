import { getTranslations } from "next-intl/server";
import { FileCommentHeader } from "@/components/file-comment-header";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { ProjectCard, Project } from "@/components/project-card";
import projectsData from "@/data/projects.json";

export default async function Projects() {
  const t = await getTranslations("projects");
  const tCommon = await getTranslations("common");
  const translateProject = t as unknown as (key: string) => string;

  const projects: Project[] = [...projectsData]
    .sort((a, b) => a.order - b.order)
    .map(({ order, ...p }) => ({
      ...p,
      name: translateProject(`${p.id}.name`),
      description: translateProject(`${p.id}.description`),
      status: p.status as Project['status'],
    }));

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
