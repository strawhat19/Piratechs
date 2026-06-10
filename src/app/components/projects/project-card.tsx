'use client';

import URLComponent from '../url/url';
import { getTechnologyMeta } from '@/shared/utils/tech';
import { isValid } from '@/shared/common/scripts/globals';
import TextReveal from '@/app/components/effects/text-reveal';
import ElementReveal from '@/app/components/effects/element-reveal';
import { projectQueryEvent, getProjectNameParam, projectSheetOpenEvent, projectSheetRouteSync } from '@/app/components/projects/project-data';

export default function ProjectCard({
  project,
  showImages = true,
}: any) {
  const projectName = getProjectNameParam(project);
  // const projectHref = getProjectQueryHref(project);

  // const getURLLabel = (url: string) => {
  //   let rootDomainName = String(extractRootDomain(url));
  //   if (rootDomainName && rootDomainName?.length >= 25) {
  //     rootDomainName = rootDomainName?.split(`.`)[0];
  //   }
  //   let urlLabel = capWords(rootDomainName);
  //   return urlLabel;
  // }

  return (
    <article className={`projectCard reveal`}>
      <>
        {showImages && project?.mediaURL && project?.mediaURL != `` && isValid(project?.mediaURL) && (
          <div className={`projectCardBG`}>
            <figure className={`projectCardBGWrap`}>
              <div className={`imgOverlay`} />
              <img className={`projectMedia`} src={project?.mediaURL} alt={project?.title} />
            </figure>
          </div>
        )}
        <a
          className={`projectCardLinkOverlay`}
          aria-label={`Open ${project?.title ?? `project`} details`}
          onClick={(event) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            window.dispatchEvent(new CustomEvent(projectSheetOpenEvent, { detail: { projectID: projectName } }));
            if (!projectSheetRouteSync) return;
            const url = new window.URL(window.location.href);
            if (url.searchParams.get(`project`) == projectName) {
              window.dispatchEvent(new CustomEvent(projectQueryEvent));
              return;
            }
            url.searchParams.set(`project`, projectName);
            window.history.pushState({ project: projectName }, ``, `${url.pathname}${url.search}${url.hash}`);
            window.dispatchEvent(new CustomEvent(projectQueryEvent));
          }}
        />
      </>
      <div className={`projectTop`}>
        {/* <ElementReveal scroll as={`span`} delay={0.02} duration={0.42} className={`typeBadge`}>
          <TextReveal scroll as={`span`} text={project.type} />
        </ElementReveal> */}
        <ElementReveal style={{ marginLeft: `auto` }} scroll as={`span`} delay={0.05} duration={0.42} className={`statusPill`}>
          <TextReveal scroll as={`span`} text={project.status} delay={0.03} />
        </ElementReveal>
      </div>
      <TextReveal scroll as={`h3`} text={project?.title} delay={0.06} />
      <ElementReveal scroll as={`div`} delay={0.12} duration={0.44} className={`projectTopics`}>
        {project.topics.map((tpc: any, index: number) => {
          const meta = getTechnologyMeta(tpc);
          return (
            <span key={tpc}>
              <i className={`${meta.icon} techIcon ${meta.className}`} />
              <TextReveal scroll as={`em`} text={tpc} delay={0.02 + index * 0.015} />
            </span>
          );
        })}
      </ElementReveal>
      <TextReveal scroll as={`p`} className={`projectDescription`} text={project.summary} duration={0.3} />
      <div className={`projectActions justifyEnd`}>
        {project?.codeUrl ? (
          <ElementReveal scroll as={`span`} delay={0.16} className={`projectActionReveal`}>
            <a href={project.codeUrl} target={`_blank`} rel={`noreferrer`} className={`buttonLink ghost`}>
              <i className={`fa-brands fa-github`} />
              <TextReveal scroll as={`span`} text={`Github`} />
            </a>
          </ElementReveal>
        ) : null}
        {project?.liveUrl ? (
          <ElementReveal scroll as={`span`} delay={0.2} className={`projectActionReveal`}>
            <URLComponent
              imageCircled={false}
              url={project?.liveUrl}
              image={project?.urlImage}
              className={`buttonLink primary`}
              label={
                project?.title
                // getURLLabel(project?.liveUrl)
              }
            />
          </ElementReveal>
        ) : null}
      </div>
    </article>
  );
}
