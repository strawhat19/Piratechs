import ElementReveal from '@/app/components/effects/element-reveal';
import featuredProjectStyles from '@/styles/featured-project-showcase.module.scss';
import { getCaseStudyHref, getProjects } from '@/app/components/projects/project-data';
import HomeLandingSection, { SplitHeading, StudioPixels } from './home-landing-section';
import LandingFeaturedProjects, { type LandingFeaturedProject } from '@/app/components/sections/landing-featured-projects';

const landingFeaturedProjects = getProjects()
  .filter(project => project?.featured)
  .map((project, index): LandingFeaturedProject => ({
    id: String(project?.id ?? project?.name ?? index),
    name: String(project?.name ?? project?.title ?? index),
    title: String(project?.title ?? project?.name ?? `Project`),
    status: String(project?.status ?? `Code`),
    summary: String(project?.summary ?? project?.description ?? ``),
    mediaURL: project?.mediaURL ? String(project.mediaURL) : undefined,
    topics: Array.isArray(project?.topics) ? project.topics.map(String) : [],
    technologies: [project?.language, project?.type, ...(Array.isArray(project?.tech) ? project.tech : [])].filter((topic): topic is string => typeof topic === `string` && topic !== `Project`),
    liveUrl: project?.liveUrl ? String(project.liveUrl) : undefined,
    codeUrl: project?.codeUrl ? String(project.codeUrl) : undefined,
    urlImage: project?.urlImage ? String(project.urlImage) : undefined,
    viewHref: getCaseStudyHref(project),
    number: String(index + 1).padStart(2, `0`),
  }));

export default function HomeFeaturedProjectsSection({ www = true }: { www?: boolean }) {
  return (
    <HomeLandingSection>
      <div className={`sep reveal`} />

      <section className={`landingStackSection${www ? ` ${featuredProjectStyles.section}` : ``}`} aria-labelledby={`landing-stack-title`}>
        <StudioPixels compact round position={`TopRight`} tone={`navy`} />
        <StudioPixels compact round position={`BottomLeft`} tone={`navy`} />
        <div className={`landingStackIntro`} data-landing-reveal>
          <span className={`landingEyebrow`}>
            Our Work
          </span>
          <SplitHeading
            as={`h2`}
            id={`landing-stack-title`}
            className={`landingStackHeading`}
            lines={[[{ text: `Featured` }, { text: `Projects` }, { text: `.`, accent: true }]]}
          />
        </div>
        <ElementReveal scroll={www} onScroll={!www} as={`div`} y={18} duration={0.68} className={`landingStackMarquee`}>
          <LandingFeaturedProjects www={www} projects={landingFeaturedProjects} />
        </ElementReveal>
      </section>
    </HomeLandingSection>
  );
}
