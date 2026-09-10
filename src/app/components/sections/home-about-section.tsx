import Link from 'next/link';
import Image from 'next/image';
import TextReveal from '@/app/components/effects/text-reveal';
import HomeLandingSection, { SplitHeading, StudioPixels } from './home-landing-section';

export default function HomeAboutSection() {
  return (
    <HomeLandingSection>
      <div className={`sep reveal`} />

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
              <TextReveal
                html
                scroll
                as={`p`}
                className={`legacyDescription`}
                text={`Piratechs began with our original digital home at <a href="https://piratechs.com/" rel="noopener noreferrer" target="_blank">piratechs.com</a>, a snapshot of the studio’s earlier identity and the foundation behind our work. The new experience you’re exploring now is the next evolution—designed to make our capabilities, process, and results easier to understand while giving ambitious ideas a clearer path from concept to launch.`}
              />
              <Link href={`https://piratechs.com/`} className={`landingInlineLink`} rel={`noopener noreferrer`} target={`_blank`}>
                Legacy Piratechs <span aria-hidden={`true`}>↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </HomeLandingSection>
  );
}
