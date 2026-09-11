import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import styles from './landing2.module.scss';
import Landing2Motion from './landing2-motion';
import { config } from '@/shared/config/config';
import Landing2Heading from './landing2-heading';
import Landing2Projects from './landing2-projects';

export const metadata: Metadata = {
  title: `Landing2 // Independent Design Studio // Piratechs`,
  description: `Piratechs is an independent design and development studio in Atlanta. Distinctive websites, ambitious applications, and digital experiences built to make an impression.`,
};

const services = [
  {
    number: `01`,
    title: `Design & Digital Identity`,
    note: `A point of view. Made unmistakable.`,
    tags: [`Art Direction`, `UI / UX`, `Design Systems`],
    description: `A clear point of view, from the first wireframe to the smallest interaction. We shape a visual language around your business and the people who use it.`,
  },
  {
    number: `02`,
    title: `Websites & Applications`,
    note: `Beautiful on the outside. Capable underneath.`,
    tags: [`Web Development`, `Full-Stack Apps`, `Responsive UI`],
    description: `Fast, accessible websites and capable applications, with a considered experience on every screen. Built with a practical foundation that can grow with your business.`,
  },
  {
    number: `03`,
    title: `Commerce & Connected Systems`,
    note: `Less friction. More possibility.`,
    tags: [`CMS & Commerce`, `APIs & Data`, `Automation`],
    description: `Bring your storefront, content, and day-to-day tools together. From Shopify and WordPress to custom APIs and automation, we help the moving parts work as one.`,
  },
];

const process = [
  { title: `Discover`, text: `Understand the ambition.` },
  { title: `Design`, text: `Give the idea a point of view.` },
  { title: `Develop`, text: `Make every detail work.` },
  { title: `Deliver`, text: `Send it out into the world.` },
];

const Arrow = ({ diagonal = false }: { diagonal?: boolean }) => (
  <svg fill={`none`} width={24} height={24} viewBox={`0 0 24 24`} aria-hidden={`true`}>
    <path d={diagonal ? `M5 19 19 5M5 5h14v14` : `M3 12h18m-7-7 7 7-7 7`} stroke={`currentColor`} strokeWidth={1.4} strokeLinecap={`round`} strokeLinejoin={`round`} />
  </svg>
);

const Landing2Page = () => (
  <div className={styles.landing} data-landing2>
    <Landing2Motion />
    <section className={styles.hero} aria-labelledby={`landing2-title`} data-l2-hero>
      <div className={styles.heroTopline} data-l2-reveal>
        <span className={styles.eyebrow}><span className={styles.statusDot} /> Independent Design & Development</span>
        <span className={styles.location}>Atlanta, GA <span aria-hidden={`true`}>/</span> Everywhere Online</span>
      </div>
      <div className={styles.heroStage}>
        <Landing2Heading as={`h1`} id={`landing2-title`} className={styles.heroTitle} lines={[{ text: `Born to` }, { text: `stand out.`, accent: true }]} delay={100} />
        <div className={styles.heroEmblem} data-l2-reveal data-l2-delay={`280`}>
          <div className={styles.emblemOrbit} aria-hidden={`true`}><span /><span /></div>
          <div className={styles.emblemCore} aria-hidden={`true`}>
            <Image preload width={816} height={1023} alt={``} sizes={`(max-width: 760px) 100px, 250px`} src={`/assets/piratechs/images/Piratechs-Full-Skull-White.png`} />
          </div>
          <span className={styles.emblemLabel}>CREATIVE SPIRIT / ENGINEERING MIND</span>
        </div>
        <a href={`#selected-work`} className={styles.heroProject} data-l2-reveal data-l2-delay={`460`}>
          <span className={styles.heroProjectImage}><Image fill alt={`Bengali Blush beauty portrait`} sizes={`(max-width: 760px) 90vw, 360px`} src={`/assets/landing2/bengali-blush.jpg`} /></span>
          <span className={styles.heroProjectCaption}><span><small>In The Spotlight</small><strong>Bengali Blush</strong></span><Arrow diagonal /></span>
        </a>
        <span className={styles.heroSideNote} aria-hidden={`true`}>DESIGN / DEVELOP / DIFFERENT</span>
      </div>
      <div className={styles.heroBottomline}>
        <p className={styles.heroDescriptor} data-l2-reveal data-l2-delay={`260`}>Independent minds.<br /><span>Extraordinary possibilities.</span></p>
        <div className={styles.heroDescription} data-l2-reveal data-l2-delay={`340`}>
          <p>We bring design and engineering together to create websites, brands, and applications people remember.</p>
          <a href={`#selected-work`} className={styles.textLink}>Discover Our Work <span aria-hidden={`true`}>↓</span></a>
        </div>
        <Link href={`/contact`} prefetch={false} className={styles.roundLink} data-l2-reveal data-l2-delay={`420`}><Arrow diagonal /><span>Let’s Talk</span></Link>
      </div>
    </section>

    <div className={styles.capabilities} aria-label={`Our capabilities`}>
      {[`Design`, `Development`, `Digital Experiences`].map(capability => <span key={capability}>{capability}<span aria-hidden={`true`}>✳</span></span>)}
    </div>

    <Landing2Projects />

    <section id={`services`} className={styles.services} aria-labelledby={`landing2-services-title`}>
      <div className={styles.sectionTopline} data-l2-reveal><span className={styles.eyebrow}>02 / What We Do</span><span>From The First Spark To The Final Detail</span></div>
      <div className={styles.servicesInner}>
        <div className={styles.sectionIntro}>
          <Landing2Heading id={`landing2-services-title`} lines={[{ text: `Good design.` }, { text: `Serious`, accent: true }, { text: `capability.`, accent: true }]} />
          <p data-l2-reveal>Creative ambition, backed by technical depth. Everything your next chapter needs, under one flag.</p>
          <Link href={`/services`} prefetch={false} className={styles.textLink} data-l2-reveal>Explore Our Services <Arrow diagonal /></Link>
        </div>
        <div className={styles.serviceList}>
          {services.map((service, index) => (
            <details key={service.number} className={styles.service} open={index === 0} data-l2-reveal data-l2-delay={String(index * 80)}>
              <summary><span className={styles.serviceNumber}>{service.number}</span><span className={styles.serviceHeading}><strong>{service.title}</strong><span>{service.note}</span></span><span className={styles.serviceToggle} aria-hidden={`true`} /></summary>
              <div className={styles.serviceBody}><p>{service.description}</p><ul aria-label={`${service.title} capabilities`}>{service.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></div>
            </details>
          ))}
        </div>
      </div>
    </section>

    <section id={`about`} className={styles.about} aria-labelledby={`landing2-about-title`}>
      <div className={styles.sectionTopline} data-l2-reveal><span className={styles.eyebrow}>03 / The Independent Spirit</span><span>Small Studio. Full-Stack Thinking.</span></div>
      <div className={styles.aboutGrid}>
        <div className={styles.aboutPortrait}>
          <div className={styles.portraitFrame} data-l2-reveal data-l2-image><Image fill alt={`Rakib Ahmed, founder of Piratechs`} sizes={`(max-width: 760px) 90vw, 460px`} src={`/assets/teams/developers/rakib/Rakib_Headshot.jpeg`} /></div>
          <span className={styles.portraitStamp} aria-hidden={`true`}>P<span>/</span></span>
          <div className={styles.portraitCaption} data-l2-reveal><strong>Rakib Ahmed</strong><span>Founder & Software Engineer</span></div>
        </div>
        <div className={styles.aboutCopy}>
          <Landing2Heading id={`landing2-about-title`} lines={[{ text: `A small studio.` }, { text: `A different`, accent: true }, { text: `kind of energy.`, accent: true }]} />
          <div className={styles.aboutDetails} data-l2-reveal>
            <span className={styles.aboutGlyph} aria-hidden={`true`}>↗</span>
            <div><p>We think like designers, build like engineers, and care like it’s our own.</p><p>Piratechs is an independent studio led by Rakib Ahmed. From enterprise software at Mitsubishi Electric to digital homes for growing businesses, we bring a wider perspective to every project.</p><Link href={`/about`} prefetch={false} className={styles.textLink}>Meet The Studio <Arrow diagonal /></Link></div>
          </div>
        </div>
      </div>
      <div className={styles.studioStats}>
        <div data-l2-reveal><strong>10<span>+</span></strong><span>Years Designing<br />& Developing</span></div>
        <div data-l2-reveal data-l2-delay={`100`}><strong>100<span>+</span></strong><span>Applications.<br />Countless Possibilities.</span></div>
        <p data-l2-reveal data-l2-delay={`180`}>Creative by nature.<br /><em>Precise by design.</em></p>
      </div>
    </section>

    <section className={styles.process} aria-labelledby={`landing2-process-title`}>
      <div className={styles.sectionTopline} data-l2-reveal><h2 id={`landing2-process-title`} className={styles.eyebrow}>04 / How We Get There</h2><span>A Clear Path. Room To Explore.</span></div>
      <ol className={styles.processSteps}>{process.map((step, index) => <li key={step.title} data-l2-reveal data-l2-delay={String(index * 90)}><span className={styles.stepNumber}>0{index + 1}<Arrow /></span><h3>{step.title}</h3><p>{step.text}</p></li>)}</ol>
    </section>

    <section className={styles.contact} aria-labelledby={`landing2-contact-title`}>
      <div className={styles.contactInner}>
        <div className={styles.sectionTopline} data-l2-reveal><span className={styles.eyebrow}>Have A Good One In Mind?</span><span>Let’s Make It Real</span></div>
        <div className={styles.contactMain}>
          <Landing2Heading id={`landing2-contact-title`} lines={[{ text: `Your next` }, { text: `big thing.`, accent: true }]} />
          <Link href={`/contact`} prefetch={false} className={styles.contactArrow} aria-label={`Start a project with Piratechs`} data-l2-reveal><Arrow diagonal /></Link>
        </div>
        <div className={styles.contactBottom} data-l2-reveal><p>A new idea. A fresh start. A better way forward.<br />We’d love to hear about it.</p><a href={`mailto:${config.contactEmail}`}>{config.contactEmail} <Arrow diagonal /></a></div>
      </div>
    </section>
  </div>
);

export default Landing2Page;
