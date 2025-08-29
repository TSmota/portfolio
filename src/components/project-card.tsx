import { BaseCard } from "./base-card";
import { StatusBadge } from "./status-badge";
import { TechStackTags } from "./tech-stack-tags";
import { ProjectLinks } from "./project-links";
import { ProjectCarousel } from "./project-carousel";

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  status: 'completed' | 'inProgress' | 'planned';
  githubUrl?: string;
  liveUrl?: string;
  images?: string[];
}

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <BaseCard padding="lg" hover>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{project.name}</h3>
        <StatusBadge status={project.status} />
      </div>
      
      {project.images && project.images.length > 0 && (
        <ProjectCarousel images={project.images} projectName={project.name} />
      )}
      
      <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>
      
      <TechStackTags technologies={project.technologies} size="sm" className="mb-4" />
      
      <ProjectLinks 
        githubUrl={project.githubUrl}
        liveUrl={project.liveUrl}
      />
    </BaseCard>
  );
}
