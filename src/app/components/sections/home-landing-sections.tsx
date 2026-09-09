import Link from 'next/link';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import { config } from '@/shared/config/config';
import Slider from '@/app/components/slider/slider';
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

type StudioPixelsProps = {
  position: `TopLeft` | `BottomRight`;
};

const landingTechnologyMeta: Record<string, TechnologyMeta> = {
  aws: { icon: `fa-brands fa-aws`, className: `techIcon-api` },
  seo: { icon: `fa-solid fa-chart-line`, className: `techIcon-data` },
  gsap: { icon: `fa-solid fa-bolt`, className: `techIcon-motion` },
  stripe: { icon: `fa-brands fa-stripe`, className: `techIcon-api` },
  vercel: { icon: `fa-solid fa-triangle`, className: `techIcon-next-js` },
  nodejs: { icon: `fa-brands fa-node-js`, className: `techIcon-javascript` },
  graphql: { icon: `fa-solid fa-diagram-project`, className: `techIcon-data` },
  figma: { icon: `fa-brands fa-figma`, className: `techIcon-design-studies` },
  docker: { icon: `fa-brands fa-docker`, className: `techIcon-api` },
  realtime: { icon: `fa-solid fa-network-wired`, className: `techIcon-websockets` },
  restapis: { icon: `fa-solid fa-cloud`, className: `techIcon-api` },
  cloudhosting: { icon: `fa-solid fa-cloud-arrow-up`, className: `techIcon-api` },
  postgresql: { icon: `fa-solid fa-database`, className: `techIcon-data` },
  accessibility: { icon: `fa-solid fa-universal-access`, className: `techIcon-auth` },
  responsiveui: { icon: `fa-solid fa-display`, className: `techIcon-pwa` },
  productdesign: { icon: `fa-solid fa-pen-ruler`, className: `techIcon-design-studies` },
  apiintegrations: { icon: `fa-solid fa-plug`, className: `techIcon-api` },
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

const process = [
  { phase: `Discover`, detail: `Define the audience, business goal, content, and technical constraints before pixels or code.` },
  { phase: `Design`, detail: `Shape a clear visual system and responsive experience that feels unmistakably yours.` },
  { phase: `Build`, detail: `Engineer the front end, integrations, and content foundation with performance in mind.` },
  { phase: `Launch`, detail: `Test the full experience, ship with confidence, and keep it healthy after release.` },
];

const technologyRows = [
  [`Next.js`, `React`, `TypeScript`, `Node.js`, `JavaScript`, `HTML5`, `CSS3`, `Sass`, `PHP`, `Python`, `WordPress`, `MySQL`, `Firebase`, `PostgreSQL`, `GraphQL`, `WebSockets`],
  [`REST APIs`, `Shopify`, `Vercel`, `AWS`, `GitHub`, `Docker`, `Figma`, `Stripe`, `GSAP`, `PWA`, `SEO`, `Accessibility`, `Responsive UI`, `API Integrations`, `Cloud Hosting`, `Product Design`],
] as const;

const StudioPixels = ({ position }: StudioPixelsProps) => (
  <span className={`landingStudioPixels landingStudioPixels${position}`} aria-hidden={`true`}>
    {Array.from({ length: 13 }, (_, index) => <i key={index} />)}
  </span>
);

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

      <section className={`landingSection landingStudioSection`}>
        <StudioPixels position={`TopLeft`} />
        <StudioPixels position={`BottomRight`} />
        <div className={`landingStudioCard`} data-landing-reveal>
          <a
            href={`https://piratechs.com/`}
            rel={`noopener noreferrer`}
            target={`_blank`}
            className={`landingStudioMark`}
            aria-label={`Visit Piratechs.com (opens in a new tab)`}
            data-landing-blur
          >
            <span className={`landingStudioCoordinate`}>
              WILL OF D.
            </span>
            <div className={`landingStudioLockup`}>
              <span className={`landingStudioLogoStage`}>
                <Image
                  fill
                  alt={`Piratechs`}
                  unoptimized
                  sizes={`(max-width: 992px) 80vw, 390px`}
                  className={`landingStudioLegacyLogo`}
                  src={`https://piratechs.com/wp-content/uploads/2021/11/PiratechsNewLowerCaseWhite-768x411.png`}
                />
                <Image
                  fill
                  alt={``}
                  unoptimized
                  aria-hidden
                  sizes={`(max-width: 992px) 80vw, 390px`}
                  className={`landingStudioDistortion`}
                  src={`/assets/piratechs/animations/piratechs-distortion-loader.webp`}
                />
              </span>
            </div>
            <span className={`landingStudioCoordinate`}>
              DESIGN // DEVELOP // DISTORT
            </span>
          </a>
          <div className={`landingStudioCopy`}>
            <span className={`landingEyebrow`}>
              Our Story
            </span>
            <SplitHeading
              as={`h2`}
              className={`landingStatement`}
              lines={[
                [{ text: `Where We` }, { text: `Were` }, { text: `.`, accent: true }],
                [{ text: `Who We` }, { text: `Are` }, { text: `.`, accent: true }],
              ]}
            />
            <div className={`landingStudioDetails`}>
              <p className={`legacyDescription`}>
                Piratechs began with our original digital home at{` `}
                <Link href={`https://piratechs.com/`} rel={`noopener noreferrer`} target={`_blank`}>piratechs.com</Link>,
                {` `}a snapshot of the studio&apos;s earlier identity and the foundation behind our work. The new experience you&apos;re exploring now is the next evolution—designed to make our capabilities, process, and results easier to understand while giving ambitious ideas a clearer path from concept to launch.
              </p>
              <Link href={`https://piratechs.com/`} className={`landingInlineLink`} rel={`noopener noreferrer`} target={`_blank`}>
                Legacy Piratechs <span aria-hidden={`true`}>↗</span>
              </Link>
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
        <div className={`landingStackMarquee`} data-landing-reveal>
          {technologyRows.map((technologies, rowIndex) => (
            <Slider
              role={`list`}
              speed={rowIndex ? 22 : 25}
              className={`landingStackList`}
              key={`technology-row-${rowIndex}`}
              id={`landingStackRow-${rowIndex + 1}`}
              direction={rowIndex ? `ltr` : `rtl`}
              trackClassName={`landingStackListTrack`}
              ariaLabel={`Technologies and services, row ${rowIndex + 1}`}
            >
              {technologies.map(technology => {
                const technologyMeta = getLandingTechnologyMeta(technology);
                return (
                  <span className={`landingStackItem`} role={`listitem`} key={technology}>
                    <i className={`${technologyMeta.icon} techIcon ${technologyMeta.className}`} aria-hidden={`true`} />
                    <span>{technology}</span>
                  </span>
                );
              })}
            </Slider>
          ))}
        </div>
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
