import Link from 'next/link';
import type { CSSProperties } from 'react';
import Logo from '@/app/components/logo/logo';
import Word from '@/app/components/logo/word';
import { config } from '@/shared/config/config';
import TextReveal from '@/app/components/effects/text-reveal';
import LandingReveal from '@/app/components/effects/landing-reveal';
import { getTechnologyMeta, type TechnologyMeta } from '@/shared/utils/tech';

type SplitToken = {
  accent?: boolean;
  accentPart?: string;
  text: string;
};

type SplitHeadingProps = {
  as: `h1` | `h2`;
  className: string;
  hero?: boolean;
  id?: string;
  lines: SplitToken[][];
  reveal?: boolean;
};

const landingTechnologyMeta: Record<string, TechnologyMeta> = {
  aws: { icon: `fa-brands fa-aws`, className: `techIcon-api` },
  realtime: { icon: `fa-solid fa-network-wired`, className: `techIcon-websockets` },
  restapis: { icon: `fa-solid fa-cloud`, className: `techIcon-api` },
  productdesign: { icon: `fa-solid fa-pen-ruler`, className: `techIcon-design-studies` },
};

const getLandingTechnologyMeta = (label: string): TechnologyMeta => {
  const key = label.replace(/[^a-zA-Z0-9#]/g, ``).toLowerCase();
  return landingTechnologyMeta[key] ?? getTechnologyMeta(key);
};

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

const services = [
  {
    title: `Websites`,
    icon: `fa-solid fa-window-maximize`,
    description: `Launch, run, and evolve a fast branded website with one studio accountable for the full lifecycle.`,
    offerings: [
      { label: `Website Development`, icon: `fa-solid fa-code` },
      { label: `Website Hosting`, icon: `fa-solid fa-server` },
      { label: `Website Maintenance`, icon: `fa-solid fa-screwdriver-wrench` },
    ],
  },
  {
    title: `Apps + Games`,
    icon: `fa-solid fa-cubes`,
    description: `Purpose-built interactive products shaped around the platform, audience, and experience they need to deliver.`,
    offerings: [
      { label: `Mobile App Development`, icon: `fa-solid fa-mobile-screen-button` },
      { label: `Game Development`, icon: `fa-solid fa-gamepad` },
    ],
  },
  {
    title: `Photo + Film`,
    icon: `fa-solid fa-clapperboard`,
    description: `Original visual content for launches, campaigns, products, people, and the moments behind the brand.`,
    offerings: [
      { label: `Videography`, icon: `fa-solid fa-video` },
      { label: `Photography`, icon: `fa-solid fa-camera` },
    ],
  },
  {
    title: `Design + Art`,
    icon: `fa-solid fa-bezier-curve`,
    description: `Distinct creative assets that give digital and physical touchpoints a coherent visual point of view.`,
    offerings: [
      { label: `Graphic Design`, icon: `fa-solid fa-pen-ruler` },
      { label: `Custom Art`, icon: `fa-solid fa-palette` },
    ],
  },
];

const process = [
  { phase: `Discover`, detail: `Define the audience, business goal, content, and technical constraints before pixels or code.` },
  { phase: `Design`, detail: `Shape a clear visual system and responsive experience that feels unmistakably yours.` },
  { phase: `Build`, detail: `Engineer the front end, integrations, and content foundation with performance in mind.` },
  { phase: `Launch`, detail: `Test the full experience, ship with confidence, and keep it healthy after release.` },
];

const technologies = [`Next.js`, `React`, `TypeScript`, `Sass`, `WordPress`, `Firebase`, `REST APIs`, `Shopify`];

function SplitHeading({ as, className, hero = false, id, lines, reveal = false }: SplitHeadingProps) {
  const Heading = as;
  let splitIndex = 0;

  return (
    <Heading
      id={id}
      className={className}
      aria-label={lines.map(line => line.map(token => token.text).join(` `).replace(/\s+([.?])/g, `$1`)).join(` `)}
      data-landing-hero={hero ? `true` : undefined}
      data-landing-reveal={reveal ? `true` : undefined}
    >
      {lines.map((line, lineIndex) => (
        <span className={`landingSplitLine`} aria-hidden={`true`} key={`line-${lineIndex}`}>
          {line.map((token, tokenIndex) => {
            const index = splitIndex++;
            return (
              <span
                className={`landingSplitWord ${token.accent ? `landingTitleAccent` : ``} ${token.text == `.` || token.text == `?` ? `landingSplitTight` : ``}`}
                key={`${token.text}-${tokenIndex}`}
                style={{ '--split-index': index } as CSSProperties}
              >
                {token.accentPart ? (
                  <>
                    {token.text.slice(0, token.text.indexOf(token.accentPart))}
                    <span className={`landingTitleAccent`}>{token.accentPart}</span>
                    {token.text.slice(token.text.indexOf(token.accentPart) + token.accentPart.length)}
                  </>
                ) : token.text}
              </span>
            );
          })}
        </span>
      ))}
    </Heading>
  );
}

export default function HomeLandingSections() {
  return (
    <div className={`piratechsLanding landingMotionPending`} data-piratechs-landing>
      <LandingReveal />
      <noscript>
        <style>{`.landingMotionPending [data-landing-reveal],.landingMotionPending .landingSplitWord{opacity:1!important;filter:none!important;transform:none!important}`}</style>
      </noscript>

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

      <section id={`services`} className={`landingSection landingServicesSection`}>
        <div className={`landingServicesLead`} data-landing-blur data-landing-reveal>
          <span className={`landingEyebrow`}>What we do</span>
          <SplitHeading
            as={`h2`}
            className={`landingDisplayHeading`}
            lines={[
              [{ text: `One` }, { text: `studio` }, { text: `.`, accent: true }],
              [{ text: `More` }, { text: `range` }, { text: `.`, accent: true }],
            ]}
          />
          <p>Digital engineering and visual production stay connected, giving every touchpoint one clear creative and technical direction.</p>
          <Link href={`/services`} className={`landingInlineLink`}>Explore services <span aria-hidden={`true`}>↗</span></Link>
        </div>

        <div className={`landingServiceList`}>
          {services.map((service, index) => (
            <article className={`landingServiceRow`} data-landing-reveal key={service.title}>
              <span className={`landingServiceIndex`}>{String(index + 1).padStart(2, `0`)}</span>
              <div className={`landingServiceCopy`}>
                <i className={`${service.icon} landingServiceIcon`} aria-hidden={`true`} />
                <TextReveal scroll as={`h3`} text={service.title} />
                <p>{service.description}</p>
              </div>
              <ul className={`landingServiceOfferings`} aria-label={`${service.title} services`}>
                {service.offerings.map(offering => (
                  <li key={offering.label}>
                    <i className={offering.icon} aria-hidden={`true`} />
                    <span>{offering.label}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className={`landingSection landingStudioSection`}>
        <div className={`landingStudioCard`} data-landing-reveal>
          <div className={`landingStudioMark`} data-landing-blur>
            <span className={`landingStudioCoordinate`}>
              WILL OF D.
            </span>
            <div className={`landingStudioLockup`}>
              <Logo fullSword className={`landingStudioLogo`} />
              <Word className={`landingStudioWordmark`} gradient={false} arrows gradientSword />
            </div>
            <span className={`landingStudioCoordinate`}>
              DESIGN // DEVELOP // DISTORT
            </span>
          </div>
          <div className={`landingStudioCopy`}>
            <span className={`landingEyebrow`}>The studio</span>
            <SplitHeading
              as={`h2`}
              className={`landingStatement`}
              lines={[
                [{ text: `Atlanta` }, { text: `studio` }, { text: `.`, accent: true }],
                [{ text: `Full-stack` }, { text: `reach` }, { text: `.`, accent: true }],
              ]}
            />
            <div className={`landingStudioDetails`}>
              <p>An independent Atlanta studio connecting web development, hosting, ongoing maintenance, apps, games, and visual production in one accountable practice.</p>
              <Link href={`/about`} className={`landingInlineLink`}>About Piratechs <span aria-hidden={`true`}>↗</span></Link>
            </div>
          </div>
        </div>
      </section>

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

      <section className={`landingStackSection`} aria-labelledby={`landing-stack-title`}>
        <div className={`landingStackIntro`} data-landing-blur data-landing-reveal>
          <span className={`landingEyebrow`}>Built on a practical stack</span>
          <SplitHeading
            as={`h2`}
            id={`landing-stack-title`}
            className={`landingStackHeading`}
            lines={[[{ text: `Modern` }, { text: `where` }, { text: `it` }, { text: `matters` }, { text: `.`, accent: true }]]}
          />
        </div>
        <ul className={`landingStackList`} data-landing-reveal>
          {technologies.map(technology => {
            const technologyMeta = getLandingTechnologyMeta(technology);
            return (
              <li key={technology}>
                <i className={`${technologyMeta.icon} techIcon ${technologyMeta.className}`} aria-hidden={`true`} />
                <span>{technology}</span>
              </li>
            );
          })}
        </ul>
      </section>

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
    </div>
  );
}
