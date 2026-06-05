import URL from '../url/url';
import type { Project } from '@/shared/types/site';
import { getTechnologyMeta } from '@/shared/utils/tech';
import { capWords, extractRootDomain } from '@/shared/common/scripts/globals';

export default function ProjectCard({ project }: { project: Project }) {

  const getURLLabel = (url: string) => {
    let rootDomainName = String(extractRootDomain(url));
    if (rootDomainName && rootDomainName?.length >= 25) {
      rootDomainName = rootDomainName?.split(`.`)[0];
    }
    let urlLabel = capWords(rootDomainName);
    return urlLabel;
  }

  return (
    <article className={`projectCard reveal`}>
      <div className={`projectTop`}>
        <span className={`typeBadge`}>
          {project.type}
        </span>
        <span className={`statusPill`}>
          {project.status}
        </span>
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
        {project?.codeUrl ? (
          <a href={project.codeUrl} target={`_blank`} rel={`noreferrer`} className={`buttonLink ghost`}>
            <i className={`fa-brands fa-github`} />
            Code
          </a>
        ) : null}
        {project?.liveUrl ? (
          <URL 
            imageCircled={false}
            url={project?.liveUrl} 
            image={project?.urlImage} 
            className={`buttonLink primary`} 
            label={getURLLabel(project?.liveUrl)} 
          />
        ) : null}
      </div>
    </article>
  );
}
