import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import styles from './landing3.module.scss';
import Landing3Motion from './landing3-motion';
import { config } from '@/shared/config/config';
import Landing3Heading from './landing3-heading';
import Landing3Projects from './landing3-projects';

export const metadata: Metadata = {
  title: `Landing3 // Design With An Independent Spirit // Piratechs`,
  description: `An independent digital studio for ambitious ideas. Piratechs brings distinctive design and thoughtful development to websites, brands, and applications.`,
};

const services = [
  {
    number: `01`,
    title: `Find your edge.`,
    discipline: `Strategy & Design`,
    tags: [`Art Direction`, `UI / UX`, `Design Systems`],
    description: `A clear idea deserves a distinct identity. We connect your business, your audience, and your point of view through thoughtful design — from the first wireframe to the final detail.`,
  },
  {
    number: `02`,
    title: `Make it move.`,
    discipline: `Websites & Applications`,
    tags: [`Web Development`, `Full-Stack Applications`, `Motion & Interaction`],
    description: `Expressive websites and useful applications, built to feel effortless. We bring design to life with responsive interfaces, purposeful motion, and a solid technical foundation.`,
  },
  {
    number: `03`,
    title: `Bring it together.`,
    discipline: `Commerce & Systems`,
    tags: [`CMS & Commerce`, `APIs & Integrations`, `Workflow Automation`],
    description: `Give your business room to grow. We connect your content, storefront, data, and everyday tools so the whole experience works together, for your customers and your team.`,
  },
];

const Arrow = ({ down = false }: { down?: boolean }) => <svg fill={`none`} width={24} height={24} viewBox={`0 0 24 24`} aria-hidden={`true`}><path d={down ? `M12 3v18m-7-7 7 7 7-7` : `M5 19 19 5M5 5h14v14`} stroke={`currentColor`} strokeWidth={1.5} strokeLinecap={`round`} strokeLinejoin={`round`} /></svg>;

const Landing3Page = () => (
  <div className={styles.landing} data-landing3>
    <Landing3Motion />
    <section className={styles.hero} aria-labelledby={`l3-title`}>
      <div className={styles.heroTop} data-l3-reveal>
        <span><i aria-hidden={`true`} /> Independent Digital Studio</span>
        <span>Atlanta, GA <b aria-hidden={`true`}>↗</b> Everywhere</span>
      </div>
      <div className={styles.heroStage}>
        <div className={styles.heroArtwork} data-l3-reveal data-l3-delay={`120`}><Image preload fill alt={``} sizes={`(max-width: 700px) 100vw, (max-width: 1600px) 68vw, 1050px`} src={`/assets/landing3/hero-sculpture.webp`} /></div>
        <Landing3Heading as={`h1`} id={`l3-title`} className={styles.heroTitle} lines={[{ text: `WE MAKE` }, { text: `WAVES.`, accent: true }]} delay={120} />
        <span className={styles.artNote} aria-hidden={`true`} data-l3-reveal data-l3-delay={`500`}>A LITTLE REBELLION.<br />A LOT OF INTENTION.</span>
        <div className={styles.heroCopy} data-l3-reveal data-l3-delay={`400`}>
          <p>Distinctive by design.<br />Exceptional by development.</p>
          <p>We turn ambitious ideas into digital experiences that look different, feel right, and work beautifully.</p>
          <Link href={`/contact`} prefetch={false} className={styles.button}>Make Something Great <span><Arrow /></span></Link>
        </div>
        <a href={`#l3-work`} className={styles.workCue} aria-label={`Scroll To Selected Work`} data-l3-reveal data-l3-delay={`600`}><span>Scroll To<br />Selected Work</span><span><Arrow down /></span></a>
      </div>
      <div className={styles.heroBottom} data-l3-reveal>
        <span>Good People. Bold Ideas.</span>
        <div><span>Design</span><i aria-hidden={`true`}>✳</i><span>Development</span><i aria-hidden={`true`}>✳</i><span>Digital Experiences</span></div>
        <span>Independent Since Day One</span>
      </div>
    </section>

    <Landing3Projects />

    <section id={`l3-services`} className={styles.services} aria-labelledby={`l3-services-title`}>
      <div className={styles.sectionTop} data-l3-reveal><span>02 / Our Capabilities</span><span>From What If. To What’s Next.</span></div>
      <div className={styles.servicesIntro}>
        <Landing3Heading id={`l3-services-title`} lines={[{ text: `THE CRAFT.` }, { text: `THE IMPACT.`, accent: true }]} />
        <p data-l3-reveal>One studio. Connected thinking.<br />We bring the creative and technical together, so every part of your project pulls in the same direction.</p>
      </div>
      <div className={styles.serviceList}>
        {services.map((service, index) => <details key={service.number} className={styles.service} open={index === 0} data-l3-reveal>
          <summary><span className={styles.serviceNumber}>{service.number}</span><span className={styles.serviceName}>{service.title}</span><span className={styles.discipline}>{service.discipline}</span><span className={styles.serviceToggle} aria-hidden={`true`} /></summary>
          <div className={styles.serviceBody}><p>{service.description}</p><ul aria-label={`${service.discipline} capabilities`}>{service.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></div>
        </details>)}
      </div>
      <Link href={`/services`} prefetch={false} className={styles.servicesLink} data-l3-reveal>Explore Our Services <Arrow /></Link>
    </section>

    <section id={`l3-studio`} className={styles.studio} aria-labelledby={`l3-studio-title`}>
      <div className={styles.sectionTop} data-l3-reveal><span>03 / The People Behind The Pixels</span><span>Small Studio. Wide Perspective.</span></div>
      <div className={styles.studioIntro}>
        <div className={styles.studioHeading}>
          <span className={styles.asterisk} aria-hidden={`true`} data-l3-reveal>✳</span>
          <Landing3Heading id={`l3-studio-title`} lines={[{ text: `SMALL BY` }, { text: `CHOICE.` }, { text: `AMBITIOUS`, accent: true }, { text: `BY NATURE.`, accent: true }]} />
        </div>
        <div className={styles.studioRight}>
          <div className={styles.portrait} data-l3-image data-l3-reveal><Image fill sizes={`(max-width: 700px) 85vw, 450px`} alt={`Rakib Ahmed, founder of Piratechs`} src={`/assets/teams/developers/rakib/Rakib_Headshot.jpeg`} /><span className={styles.portraitLabel}>Rakib Ahmed <span>Founder / Software Engineer</span></span></div>
          <div className={styles.studioCopy} data-l3-reveal><p>Your project deserves more than a handoff.</p><p>Piratechs is an independent studio led by Rakib Ahmed. You work directly with the person shaping your experience and building the details that make it work.</p><p>From enterprise software at Mitsubishi Electric to digital homes for independent businesses, we bring design instinct and engineering experience to the same table.</p><Link href={`/about`} prefetch={false} className={styles.textLink}>A Little More About Us <Arrow /></Link></div>
        </div>
      </div>
      <div className={styles.studioBottom}>
        <p data-l3-reveal>Curious minds.<br />Capable hands.</p>
        <div data-l3-reveal><strong>10<span>+</span></strong><span>Years Of Design<br />& Development</span></div>
        <div data-l3-reveal data-l3-delay={`100`}><strong>100<span>+</span></strong><span>Applications<br />Built Along The Way</span></div>
      </div>
    </section>

    <section className={styles.contact} aria-labelledby={`l3-contact-title`}>
      <div className={styles.sectionTop} data-l3-reveal><span>Have Something In Mind?</span><span>Let’s See Where It Goes.</span></div>
      <Link href={`/contact`} prefetch={false} className={styles.contactMain} aria-label={`Let’s make waves. Start your project with Piratechs`}>
        <Landing3Heading id={`l3-contact-title`} lines={[{ text: `LET’S MAKE` }, { text: `WAVES.`, accent: true }]} /><span className={styles.contactArrow} data-l3-reveal><Arrow /></span>
      </Link>
      <div className={styles.contactBottom} data-l3-reveal><p>Your next chapter starts with a conversation.</p><a href={`mailto:${config.contactEmail}`}>{config.contactEmail}<Arrow /></a></div>
    </section>
  </div>
);

export default Landing3Page;
