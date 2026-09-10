import HomeAboutSection from './home-about-section';
import HomeFeaturedProjectsSection from './home-featured-projects-section';
// import { config } from '@/shared/config/config';

const selectedWork = [
  {
    index: `01`,
    title: `Forge`,
    type: `Client platform`,
    description: `A polished product experience for cloud deployment intelligence, translating complex infrastructure workflows into a clear, confident interface.`,
    tags: [`Next.js`, `Product Design`, `AWS`],
    href: `/projects`,
    linkLabel: `Project archive`,
  },
  {
    index: `02`,
    title: `Creative Workshop`,
    type: `Commerce experience`,
    description: `A responsive storefront connecting Shopify, React, and real-time functionality for a dynamic creative studio.`,
    tags: [`Shopify`, `React`, `Realtime`],
    href: `/case-studies/CreativeWorkshop`,
    linkLabel: `View case study`,
  },
  {
    index: `03`,
    title: `Dyer & Posta`,
    type: `Branded website`,
    description: `A WordPress-based digital presence for a Kennesaw salon, shaped around content, services, and a distinct brand character.`,
    tags: [`WordPress`, `PHP`, `CSS`],
    href: `/case-studies/Dyer-Posta`,
    linkLabel: `View case study`,
  },
];

const process = [
  { phase: `Discover`, detail: `Define the audience, business goal, content, and technical constraints before pixels or code.` },
  { phase: `Design`, detail: `Shape a clear visual system and responsive experience that feels unmistakably yours.` },
  { phase: `Build`, detail: `Engineer the front end, integrations, and content foundation with performance in mind.` },
  { phase: `Launch`, detail: `Test the full experience, ship with confidence, and keep it healthy after release.` },
];

export default function HomeLandingSections({ about = true, projects = true }: { about?: boolean; projects?: boolean }) {
  return (
    <>
      {projects && <HomeFeaturedProjectsSection />}

      {/* <section id={`selected-work`} className={`landingSection landingWorkSection`}>
        <div className={`landingSectionHeading`} data-landing-blur data-landing-reveal>
          <span className={`landingEyebrow`}>Selected work</span>
          <SplitHeading
            as={`h2`}
            className={`landingDisplayHeading`}
            lines={[
              [{ text: `Different` }, { text: `challenges` }, { text: `.`, accent: true }],
              [{ text: `One` }, { text: `sharp` }, { text: `standard` }, { text: `.`, accent: true }],
            ]}
          />
          <p>Digital products and web experiences built around the client, the audience, and the job the interface needs to do.</p>
        </div>

        <div className={`landingWorkGrid`}>
          {selectedWork.map(work => (
            <article className={`landingWorkCard`} data-landing-reveal key={work.title}>
              <div className={`landingWorkMeta`}>
                <span>{work.index}</span>
                <span>{work.type}</span>
              </div>
              <div className={`landingWorkSymbol`} aria-hidden={`true`}>
                <span>{work.index}</span>
                <i className={getLandingTechnologyMeta(work.tags[0]).icon} />
              </div>
              <div className={`landingWorkBody`}>
                <h3>{work.title}</h3>
                <p>{work.description}</p>
              </div>
              <ul className={`landingTagList landingTechnologyList`} aria-label={`${work.title} technologies`}>
                {work.tags.map(tag => {
                  const technology = getLandingTechnologyMeta(tag);
                  return (
                    <li key={tag}>
                      <i className={`${technology.icon} techIcon ${technology.className}`} aria-hidden={`true`} />
                      <span>{tag}</span>
                    </li>
                  );
                })}
              </ul>
              <Link className={`landingWorkLink`} href={work.href}>
                {work.linkLabel}<span aria-hidden={`true`}>↗</span>
              </Link>
            </article>
          ))}
        </div>
      </section> */}

      {about && <HomeAboutSection />}

      {/* <section id={`process`} className={`landingSection landingProcessSection`}>
        <div className={`landingProcessLead`} data-landing-blur data-landing-reveal>
          <span className={`landingEyebrow`}>How we work</span>
          <SplitHeading
            as={`h2`}
            className={`landingDisplayHeading`}
            lines={[
              [{ text: `Clear` }, { text: `steps` }, { text: `.`, accent: true }],
              [{ text: `No` }, { text: `black` }, { text: `box` }, { text: `.`, accent: true }],
            ]}
          />
          <p>Enough structure to keep momentum. Enough flexibility to make the right decision when the work changes.</p>
        </div>

        <ol className={`landingProcessList`}>
          {process.map((step, index) => (
            <li data-landing-reveal key={step.phase}>
              <span>{String(index + 1).padStart(2, `0`)}</span>
              <h3>{step.phase}</h3>
              <p>{step.detail}</p>
            </li>
          ))}
        </ol>
      </section> */}

      {/* <section className={`landingSection landingContactSection`}>
        <div className={`landingContactCard`} data-landing-blur data-landing-reveal>
          <div>
            <span className={`landingEyebrow`}>Start something useful</span>
            <SplitHeading
              as={`h2`}
              className={`landingDisplayHeading`}
              lines={[
                [{ text: `Ready` }, { text: `for` }, { text: `the` }],
                [{ text: `next` }, { text: `version` }, { text: `?`, accent: true }],
              ]}
            />
          </div>
          <div className={`landingContactDetails`}>
            <p>Tell us what you are building, where it is stuck, or what the current experience needs to become.</p>
            <a className={`landingEmailLink`} href={`mailto:${config.contactEmail}`}>
              {config.contactEmail}<span aria-hidden={`true`}>↗</span>
            </a>
            <Link href={`/contact`} className={`landingCta`}>
              Start a project <span aria-hidden={`true`}>↗</span>
            </Link>
          </div>
        </div>
      </section> */}
    </>
  );
}
