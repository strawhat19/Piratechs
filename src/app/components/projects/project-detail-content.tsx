'use client';

import Link from 'next/link';
import URL from '../url/url';
import { getTechnologyMeta } from '@/shared/utils/tech';
import TextReveal from '@/app/components/effects/text-reveal';
import ElementReveal from '@/app/components/effects/element-reveal';
import { getCaseStudyHref, findProjectByID } from '@/app/components/projects/project-data';

type ProjectDetailContentProps = {
  projectID: string;
  showCaseStudyLink?: boolean;
};

export default function ProjectDetailContent({
  projectID,
  showCaseStudyLink = false,
}: ProjectDetailContentProps) {
  const project = findProjectByID(projectID);
  const topics = project?.topics ?? [];

  if (!project) {
    return (
      <div className={`projectDetailSheetInner projectDetailMissing`}>
        <div className={`projectDetailContent`}>
          <TextReveal as={`h2`} text={`Project Not Found`} />
          <TextReveal as={`p`} text={`This project may have moved or the link is no longer available.`} delay={0.08} />
        </div>
      </div>
    );
  }

  return (
    <div className={`projectDetailSheetInner`}>
      {project?.mediaURL ? (
        <ElementReveal as={`figure`} y={22} duration={0.58} className={`projectDetailMedia`}>
          <ElementReveal as={`div`} y={16} delay={0.08} className={`projectDetailMeta`}>
            <span className={`statusPill`}>
              <TextReveal as={`span`} text={project.status} delay={0.08} />
            </span>
          </ElementReveal>
          <img src={project.mediaURL} alt={project.title} />
        </ElementReveal>
      ) : null}
      <div className={`projectDetailContent`}>
        <TextReveal as={`h2`} text={project.title} className={`projectDetailTitle`} delay={0.12} />
        <TextReveal as={`p`} className={`projectDetailSummary`} text={project.summary} delay={0.14} />
        {topics?.length ? (
          <ElementReveal as={`div`} y={14} delay={0.16} className={`projectTopics projectDetailTopics`}>
            {topics.map((topic: string, index: number) => {
              const meta = getTechnologyMeta(topic);
              return (
                <span key={topic}>
                  <i className={`${meta.icon} techIcon ${meta.className}`} />
                  <TextReveal as={`em`} text={topic} delay={0.02 + index * 0.015} />
                </span>
              );
            })}
          </ElementReveal>
        ) : null}
        <div className={`projectActions projectDetailActions`}>
          {showCaseStudyLink ? (
            <ElementReveal as={`span`} delay={0.18} className={`projectActionReveal`}>
              <Link href={getCaseStudyHref(project)} className={`buttonLink ghost`}>
                <i className={`fa-solid fa-book-open`} />
                <TextReveal as={`span`} text={`Case Study`} />
              </Link>
            </ElementReveal>
          ) : null}
          {project?.codeUrl ? (
            <ElementReveal as={`span`} delay={showCaseStudyLink ? 0.22 : 0.18} className={`projectActionReveal`}>
              <a href={project.codeUrl} target={`_blank`} rel={`noreferrer`} className={`buttonLink ghost`}>
                <i className={`fa-brands fa-github`} />
                <TextReveal as={`span`} text={`Github`} />
              </a>
            </ElementReveal>
          ) : null}
          {project?.liveUrl ? (
            <ElementReveal as={`span`} delay={showCaseStudyLink ? 0.26 : 0.22} className={`projectActionReveal`}>
              <URL
                imageCircled={false}
                url={project.liveUrl}
                label={project.title}
                image={project.urlImage}
                className={`buttonLink primary`}
              />
            </ElementReveal>
          ) : null}
        </div>
      </div>
    </div>
  );
}
