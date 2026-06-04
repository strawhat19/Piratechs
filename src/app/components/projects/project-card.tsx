import { getTechnologyMeta } from '@/shared/utils/tech';
import type { Project } from '@/shared/types/site';

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={`projectCard reveal`}>
      <div className={`projectTop`}>
        <span className={`typeBadge`}>{project.type}</span>
        <span className={`statusPill`}>{project.status}</span>
      </div>
      <div className={`projectIconCloud`} aria-hidden={`true`}>
        {project.tech.slice(0, 5).map(tech => {
          const meta = getTechnologyMeta(tech);
          return <i key={tech} className={`${meta.icon} techIcon ${meta.className}`} />;
        })}
      </div>
      <h3>{project.title}</h3>
      <p>{project.summary}</p>
      <div className={`techList`}>
        {project.tech.map(tech => {
          const meta = getTechnologyMeta(tech);
          return (
            <span key={tech}>
              <i className={`${meta.icon} techIcon ${meta.className}`} />
              {tech}
            </span>
          );
        })}
      </div>
      <div className={`projectActions`}>
        {project.liveUrl ? (
          <a href={project.liveUrl} target={`_blank`} rel={`noreferrer`} className={`buttonLink primary`}>
            <i className={`fa-solid fa-arrow-up-right-from-square`} />
            Live
          </a>
        ) : null}
        {project.codeUrl ? (
          <a href={project.codeUrl} target={`_blank`} rel={`noreferrer`} className={`buttonLink ghost`}>
            <i className={`fa-brands fa-github`} />
            Code
          </a>
        ) : null}
      </div>
    </article>
  );
}
