import Link from 'next/link';
import Image from 'next/image';
import Landing3Heading from './landing3-heading';
import styles from './landing3-projects.module.scss';

const ProjectArrow = () => <span aria-hidden={true} className={styles.arrow}>↗</span>;

const Landing3Projects = () => (
  <section id={`l3-work`} className={styles.section} aria-labelledby={`l3-work-title`}>
    <div className={styles.label} data-l3-reveal><span>01 / Selected Work</span><span>Three Different Worlds. One Studio.</span></div>
    <div className={styles.heading}>
      <Landing3Heading id={`l3-work-title`} lines={[{ text: `Ideas made` }, { text: `real.`, accent: true }]} />
      <p data-l3-reveal>From a beauty atelier to tools for better building. Digital experiences with a point of view.</p>
      <span aria-hidden={true} className={styles.workCount} data-l3-reveal>03</span>
    </div>
    <div className={styles.projects}>
      <Link prefetch={false} className={styles.project} href={`/case-studies/bengaliblush`} aria-label={`View The Bengali Blush Case Study`}>
        <div className={`${styles.frame} ${styles.blushFrame}`} data-l3-image>
          <div aria-hidden={true} className={styles.frameIndex}><span>01</span><span>Beauty, With A Point Of View</span></div>
          <div className={styles.blushBrowser}>
            <div aria-hidden={true} className={styles.browserBar}><span className={styles.browserDots}><i /><i /><i /></span><span>Bengali Blush / The Beauty Atelier</span><span>↗</span></div>
            <div className={styles.blushScreen}>
              <div aria-hidden={true} className={styles.blushEditorial}>
                <span className={styles.blushWordmark}>bengali<br /><em>blush</em><span>BEAUTY ATELIER</span></span>
                <p>The art of<br /><em>being you.</em></p>
                <span className={styles.blushNote}>Rooted In Heritage.<br />Made For Your Every Day.</span>
              </div>
              <div className={styles.blushPhoto}>
                <Image fill alt={`Bengali Blush beauty portrait with warm light and rich traditional jewelry`} src={`/assets/landing2/bengali-blush.jpg`} sizes={`(max-width: 600px) 68vw, (max-width: 1600px) 47vw, 700px`} />
                <span aria-hidden={true} className={styles.photoStamp}>A Little<br /><em>Blush.</em></span>
              </div>
            </div>
          </div>
          <span aria-hidden={true} className={styles.frameFootnote}>An Expressive Digital Home For Beauty & Craft</span>
        </div>
        <div className={styles.caption} data-l3-reveal>
          <h3>Bengali Blush</h3>
          <p>Brand Experience <span>/</span> E-Commerce</p>
          <span className={styles.caseStudy}>View Case Study <ProjectArrow /></span>
        </div>
      </Link>
      <Link prefetch={false} className={styles.project} href={`/case-studies/Forge`} aria-label={`View The Forge Case Study`}>
        <div className={`${styles.frame} ${styles.forgeFrame}`} data-l3-image>
          <div aria-hidden={true} className={styles.frameIndex}><span>02</span><span>Clarity For Cloud Complexity</span></div>
          <div aria-hidden={true} className={styles.forgeGrid} />
          <div aria-hidden={true} className={styles.forgeCopy}><span>Cloud Intelligence</span><p>Built for<br /><em>builders.</em></p><span>CloudFormation. Brought Into Focus.</span></div>
          <div className={styles.forgeArt}>
            <span aria-hidden={true} className={styles.forgeOrbit} />
            <Image alt={`The red Forge mark`} width={356} height={433} sizes={`(max-width: 600px) 128px, (max-width: 1000px) 200px, 260px`} className={styles.forgeMark} src={`/assets/landing2/forge-mark.png`} />
          </div>
          <span aria-hidden={true} className={styles.forgeWordmark}>Forge<span>↗</span></span>
          <span aria-hidden={true} className={styles.forgeCoordinates}>[ DESIGN × DEVELOPMENT ]</span>
        </div>
        <div className={styles.caption} data-l3-reveal>
          <h3>Forge</h3>
          <p>Product Design <span>/</span> Developer Platform</p>
          <span className={styles.caseStudy}>View Case Study <ProjectArrow /></span>
        </div>
      </Link>
      <Link prefetch={false} className={styles.project} href={`/case-studies/Smart-Garden`} aria-label={`View The Smart Garden Case Study`}>
        <div className={`${styles.frame} ${styles.gardenFrame}`} data-l3-image>
          <div aria-hidden={true} className={styles.frameIndex}><span>03</span><span>A Little Technology. A Little More Nature.</span></div>
          <div aria-hidden={true} className={styles.gardenRing} />
          <div aria-hidden={true} className={styles.gardenCopy}><span>Smart Garden</span><p>Room<br />to <em>grow.</em></p><span>A Greener Everyday,<br />One Good Idea At A Time.</span></div>
          <div className={styles.gardenScreen}>
            <div aria-hidden={true} className={styles.gardenBar}><span className={styles.browserDots}><i /><i /><i /></span><span>Smart Garden / Your Digital Growing Companion</span></div>
            <Image width={2558} height={1436} className={styles.gardenImage} src={`/assets/landing2/smart-garden.png`} sizes={`(max-width: 600px) 94vw, (max-width: 1600px) 68vw, 1020px`} alt={`Smart Garden website featuring a colorful botanical design and its AI garden assistant`} />
          </div>
          <span aria-hidden={true} className={styles.gardenStar}>✳</span>
        </div>
        <div className={styles.caption} data-l3-reveal>
          <h3>Smart Garden</h3>
          <p>Web Application <span>/</span> AI Assistance</p>
          <span className={styles.caseStudy}>View Case Study <ProjectArrow /></span>
        </div>
      </Link>
    </div>
    <div className={styles.footer} data-l3-reveal><span>Good Work Comes In Many Forms.</span><Link href={`/projects`} prefetch={false}>Explore The Archive <span aria-hidden={true}>↗</span></Link></div>
  </section>
);

export default Landing3Projects;
