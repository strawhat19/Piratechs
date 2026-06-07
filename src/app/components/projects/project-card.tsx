import URL from '../url/url';
import { getTechnologyMeta } from '@/shared/utils/tech';
import TextReveal from '@/app/components/effects/text-reveal';
import ElementReveal from '@/app/components/effects/element-reveal';
// import type { Project } from '@/shared/models/Project';
import { capWords, extractRootDomain } from '@/shared/common/scripts/globals';

export default function ProjectCard({ project }: any) {
  const projectUrl = project?.codeUrl || project?.liveUrl;

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
      {projectUrl ? (
        <a
          href={projectUrl}
          target={`_blank`}
          rel={`noreferrer`}
          className={`projectCardLinkOverlay`}
          aria-label={`Open ${project?.title ?? `project`} in a new tab`}
        />
      ) : null}
      <div className={`projectTop`}>
        <ElementReveal scroll as={`span`} delay={0.02} duration={0.42} className={`typeBadge`}>
          <TextReveal scroll as={`span`} text={project.type} />
        </ElementReveal>
        <ElementReveal scroll as={`span`} delay={0.05} duration={0.42} className={`statusPill`}>
          <TextReveal scroll as={`span`} text={project.status} delay={0.03} />
        </ElementReveal>
      </div>
      <ElementReveal scroll as={`div`} delay={0.06} duration={0.42} className={`projectIconCloud`} aria-hidden={`true`}>
        {project.tech.slice(0, 5).map((tech: any) => {
          const meta = getTechnologyMeta(tech);
          return <i key={tech} className={`${meta.icon} techIcon ${meta.className}`} />;
        })}
      </ElementReveal>
      <TextReveal scroll as={`h3`} text={project.title} delay={0.06} />
      <TextReveal scroll as={`p`} text={project.summary} duration={0.3} />
      <ElementReveal scroll as={`div`} delay={0.12} duration={0.44} className={`techList`}>
        {project.tech.map((tech: any, index: number) => {
          const meta = getTechnologyMeta(tech);
          return (
            <span key={tech}>
              <i className={`${meta.icon} techIcon ${meta.className}`} />
              <TextReveal scroll as={`em`} text={tech} delay={0.02 + index * 0.015} />
            </span>
          );
        })}
      </ElementReveal>
      <div className={`projectActions`}>
        {project?.codeUrl ? (
          <ElementReveal scroll as={`span`} delay={0.16} className={`projectActionReveal`}>
            <a href={project.codeUrl} target={`_blank`} rel={`noreferrer`} className={`buttonLink ghost`}>
              <i className={`fa-brands fa-github`} />
              <TextReveal scroll as={`span`} text={`Code`} />
            </a>
          </ElementReveal>
        ) : null}
        {project?.liveUrl ? (
          <ElementReveal scroll as={`span`} delay={0.2} className={`projectActionReveal`}>
            <URL 
              imageCircled={false}
              url={project?.liveUrl} 
              image={project?.urlImage} 
              className={`buttonLink primary`} 
              label={getURLLabel(project?.liveUrl)} 
            />
          </ElementReveal>
        ) : null}
      </div>
    </article>
  );
}
