import Link from 'next/link';
import Image from 'next/image';
import Landing2Heading from './landing2-heading';
import styles from './landing2-projects.module.scss';

const ProjectArrow = () => <span aria-hidden={true} className={styles.arrow}>↗</span>;

const Landing2Projects = () => (
  <section id={`selected-work`} className={styles.section} aria-labelledby={`selected-work-title`}>
    <div className={styles.sectionLabel} data-l2-reveal><span>01 / Selected Work</span><span>A Few Recent Chapters <span className={styles.projectCount}>(03)</span></span></div>
    <div className={styles.heading}>
      <div>
        <Landing2Heading id={`selected-work-title`} lines={[{ text: `Different worlds.` }, { text: `The same care.`, accent: true }]} />
      </div>
      <p className={styles.introduction} data-l2-reveal data-l2-delay={`120`}>Beauty brands. Developer tools. A greener everyday. Different challenges, each given our full attention.</p>
    </div>
    <div className={styles.projects}>
      <Link prefetch={false} className={styles.leadProject} href={`/case-studies/bengaliblush`} aria-label={`View The Bengali Blush Case Study`}>
        <div className={styles.blushVisual} data-l2-image data-l2-reveal>
          <div className={styles.blushCopy}>
            <span className={styles.blushLabel}>Bengali Blush<span>Beauty Atelier</span></span>
            <p>A softer<br />kind of<br /><em>statement.</em></p>
            <div className={styles.blushFootnote}><span>Rooted In Heritage.<br />Made For You.</span><span aria-hidden={true}>✳</span></div>
          </div>
          <div className={styles.blushPhoto}>
            <Image fill alt={`Warm-toned beauty portrait from the Bengali Blush atelier`} src={`/assets/landing2/bengali-blush.jpg`} sizes={`(max-width: 600px) 90vw, (max-width: 1600px) 50vw, 792px`} />
            <span className={styles.blushPhotoLabel}>The Art Of Feeling Like Yourself</span>
          </div>
        </div>
        <div className={styles.caption} data-l2-reveal>
          <div><p className={styles.category}><span>01</span>Brand Experience / Commerce</p><h3>Bengali Blush</h3></div>
          <p className={styles.projectDescription}>An expressive digital home for beauty, craft, and everyday confidence.</p>
          <ProjectArrow />
        </div>
      </Link>
      <Link prefetch={false} className={styles.project} href={`/case-studies/Forge`} aria-label={`View The Forge Case Study`}>
        <div className={styles.forgeVisual} data-l2-image data-l2-reveal>
          <div className={styles.forgeTopline}><span>Cloud Intelligence</span><span>Built For Builders</span></div>
          <div className={styles.forgeIdentity}>
            <Image alt={``} width={356} height={433} sizes={`(max-width: 540px) 95px, 140px`} className={styles.forgeMark} src={`/assets/landing2/forge-mark.png`} />
            <span>Forge<span className={styles.forgeDot}>.</span></span>
          </div>
          <div className={styles.forgeBaseline}><span>Complex infrastructure.<br />Clearer decisions.</span><span aria-hidden={true}>[ F ]</span></div>
        </div>
        <div className={styles.caption} data-l2-reveal>
          <div><p className={styles.category}><span>02</span>Developer Platform / Product Design</p><h3>Forge</h3></div>
          <ProjectArrow />
        </div>
        <p className={styles.secondaryDescription} data-l2-reveal>A focused home for CloudFormation deployment intelligence.</p>
      </Link>
      <Link prefetch={false} href={`/case-studies/Smart-Garden`} className={`${styles.project} ${styles.gardenProject}`} aria-label={`View The Smart Garden Case Study`}>
        <div className={styles.gardenVisual} data-l2-image data-l2-reveal data-l2-delay={`120`}>
          <div className={styles.gardenTopline}><span>Good Things Take Root</span><span aria-hidden={true}>↗</span></div>
          <p className={styles.gardenStatement}>Grow something <em>good.</em></p>
          <div className={styles.gardenScreen}>
            <Image width={2558} height={1436} className={styles.gardenImage} src={`/assets/landing2/smart-garden.png`} sizes={`(max-width: 760px) 80vw, (max-width: 1600px) 37vw, 600px`} alt={`Smart Garden AI website with colorful botanical shapes and a garden assistant introduction`} />
          </div>
          <span className={styles.gardenFootnote}>Smart Garden / Application</span>
        </div>
        <div className={styles.caption} data-l2-reveal>
          <div><p className={styles.category}><span>03</span>Web Application / AI Assistance</p><h3>Smart Garden</h3></div>
          <ProjectArrow />
        </div>
        <p className={styles.secondaryDescription} data-l2-reveal>Plant care, garden journals, and helpful guidance in one place.</p>
      </Link>
    </div>
    <div className={styles.projectsFooter} data-l2-reveal><p>There’s More Where That Came From.</p><Link href={`/projects`} prefetch={false} className={styles.allProjects}>Explore All Projects <span aria-hidden={true}>↗</span></Link></div>
  </section>
);

export default Landing2Projects;
