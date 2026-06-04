import ProjectCard from '@/app/components/projects/project-card';
import { siteConfig } from '@/shared/config/site';

export default function ProjectGrid({ featuredOnly = false }: { featuredOnly?: boolean }) {
  const projects = featuredOnly ? siteConfig.projects.filter(project => project.featured) : siteConfig.projects;

  return (
    <div className={`projectGrid`}>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
