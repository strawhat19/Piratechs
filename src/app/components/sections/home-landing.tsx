'use client';

import gsap from 'gsap';
import Link from 'next/link';
import Logo from '../logo/logo';
import Word from '../logo/word';
import AuthWidget from '../auth/auth-widget';
import HeroContent from '../hero/hero-content';
import { config } from '@/shared/config/config';
import HomeLandingSections from './home-landing-sections';
import HomeServiceEstimator from './home-service-estimator';
import { useGlobalContext } from '@/shared/global-context';
import { useCallback, useLayoutEffect, useRef } from 'react';
import TextReveal from '@/app/components/effects/text-reveal';
import AvatarAnimation from '../media/avatar/avatar-animation';
import { scrollToElement } from '@/shared/common/scripts/globals';
import ElementReveal from '@/app/components/effects/element-reveal';
import HeroBg, { type HeroBgMilestoneHandler } from '../hero/hero-bg';
import { pageTransitionCompleteClass, pageTransitionReadyEvent } from '@/app/components/effects/page-transition-events';
import { HomeCapabilityRadar, HomeManifestoReveal, HomeProjectBento, HomeProjectVoyageSlider, HomeVoyageMetrics } from './home-landing-alternatives';

const logoHoverAnimationClass = `logoHoverAnimation`;

type HeroBgAnimationHandlers = {
  gridPlaneRevealStart?: HeroBgMilestoneHandler;
  circuitRevealComplete?: HeroBgMilestoneHandler;
  signalLineRevealComplete?: () => void;
};

export default function HomeLanding() {
  const page: any = config?.pages?.home;
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const heroBgAnimationHandlersRef = useRef<HeroBgAnimationHandlers>({});

  const { width } = useGlobalContext();

  const gridPlaneRevealStart = useCallback<HeroBgMilestoneHandler>((releaseAccents) => {
    heroBgAnimationHandlersRef.current.gridPlaneRevealStart?.(releaseAccents);
  }, []);
  const circuitRevealComplete = useCallback<HeroBgMilestoneHandler>((releaseAccents) => {
    heroBgAnimationHandlersRef.current.circuitRevealComplete?.(releaseAccents);
  }, []);
  const signalLineRevealComplete = useCallback(() => {
    heroBgAnimationHandlersRef.current.signalLineRevealComplete?.();
  }, []);

  useLayoutEffect(() => {
    const heroSection = heroSectionRef.current;

    const heroLogoPlate = heroSection?.querySelector<HTMLElement>(`.heroLogoPlate`);
    const avatarAnimation = heroSection?.querySelector<HTMLElement>(`.homeAvatarAccent`);
    const avatarArcText = avatarAnimation?.querySelector<HTMLElement>(`.avatarArcTextWrap`);

    if (!heroLogoPlate || !avatarAnimation) return;

    const prefersReducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
    if (prefersReducedMotion) {
      heroLogoPlate.classList.remove(logoHoverAnimationClass);
      gsap.set(avatarAnimation, { clearProps: `clipPath,webkitClipPath` });
      if (avatarArcText) gsap.set(avatarArcText, { clearProps: `clipPath,webkitClipPath` });
      return;
    }

    let accentsComplete = false;
    let laughingTimeline: gsap.core.Timeline | null = null;
    let shuttersComplete = document.body.classList.contains(pageTransitionCompleteClass);
    const logoAnimationPause = { progress: 0 };

    gsap.set(avatarAnimation, {
      clipPath: `circle(0% at 100% 50%)`,
      webkitClipPath: `circle(0% at 100% 50%)`,
    });
    if (avatarArcText) {
      gsap.set(avatarArcText, {
        clipPath: `circle(0% at 50% 50%)`,
        webkitClipPath: `circle(0% at 50% 50%)`,
      });
    }

    const revealAvatarText = () => {
      if (!avatarArcText) return;
      gsap.to(avatarArcText, {
        duration: 0.2,
        ease: `power3.out`,
        clipPath: `circle(75% at 50% 50%)`,
        webkitClipPath: `circle(75% at 50% 50%)`,
        onComplete: () => {
          gsap.set(avatarArcText, { clearProps: `clipPath,webkitClipPath` });
        },
      });
    };

    const revealAvatar: HeroBgMilestoneHandler = (releaseAccents) => {
      if (accentsComplete) return;
      accentsComplete = true;
      releaseAccents();
      gsap.to(avatarAnimation, {
        duration: 0.44,
        ease: `power3.out`,
        clipPath: `circle(50% at 50% 50%)`,
        webkitClipPath: `circle(50% at 50% 50%)`,
        onComplete: () => {
          gsap.set(avatarAnimation, { clearProps: `clipPath,webkitClipPath` });
          revealAvatarText();
        },
      });
    };

    const finishWithSkullLaugh = () => {
      if (!shuttersComplete) return;
      laughingTimeline?.kill();
      heroLogoPlate.classList.remove(logoHoverAnimationClass);
      laughingTimeline = gsap.timeline();
      laughingTimeline
        .call(() => heroLogoPlate.classList.add(logoHoverAnimationClass))
        .to(logoAnimationPause, { progress: 1, duration: 0.14, ease: `power2.out` })
        .call(() => heroLogoPlate.classList.remove(logoHoverAnimationClass))
        .to(logoAnimationPause, { progress: 0, duration: 0.1, ease: `power2.inOut` })
        .call(() => heroLogoPlate.classList.add(logoHoverAnimationClass))
        .to(logoAnimationPause, { progress: 1, duration: 0.2, ease: `power2.out` })
        .call(() => heroLogoPlate.classList.remove(logoHoverAnimationClass))
        .to(logoAnimationPause, { progress: 0, duration: 0.16, ease: `power2.inOut` });
    };

    const shuttersCompleteHandler = () => {
      shuttersComplete = true;
    };

    heroBgAnimationHandlersRef.current = {
      gridPlaneRevealStart: revealAvatar,
      circuitRevealComplete: revealAvatar,
      signalLineRevealComplete: finishWithSkullLaugh,
    };
    if (!shuttersComplete) {
      window.addEventListener(pageTransitionReadyEvent, shuttersCompleteHandler, { once: true });
    }

    return () => {
      laughingTimeline?.kill();
      heroLogoPlate.classList.remove(logoHoverAnimationClass);
      heroBgAnimationHandlersRef.current = {};
      window.removeEventListener(pageTransitionReadyEvent, shuttersCompleteHandler);
      gsap.killTweensOf([logoAnimationPause, avatarAnimation, avatarArcText]);
      gsap.set(avatarAnimation, { clearProps: `clipPath,webkitClipPath` });
      if (avatarArcText) gsap.set(avatarArcText, { clearProps: `clipPath,webkitClipPath` });
    };
  }, []);

  return (
    <>
      <section ref={heroSectionRef} className={`pageSection heroSection`}>
        <HeroBg
          onGridPlaneRevealStart={gridPlaneRevealStart}
          onCircuitRevealComplete={circuitRevealComplete}
          onSignalLineRevealComplete={signalLineRevealComplete}
        />
        <HeroContent
          start={
            <>
              <AvatarAnimation
                size={135}
                reveal={false}
                className={`ceoHeadshotContainer homeAvatarAccent`}
                text={`Rakib Ahmed // Developer // Designer // Atlanta // Georgia // USA //`}
              />
              <TextReveal as={`span`} className={`eyebrow`} text={page.eyebrow} delay={0.4} />
              {page?.html ? (
                <TextReveal as={`h1`} className={`bannerText`} text={page.html} html delay={0.1} />
              ) : (
                <TextReveal as={`h1`} className={`bannerText`} text={page.title} delay={0.1} />
              )}
              {page?.summaryHtml ? (
                <TextReveal as={`p`} className={`bannerText`} text={`<i>${page?.summaryHtml}</i>`} html />
              ) : (
                <TextReveal as={`p`} className={`bannerText`} text={`<i>${page?.summary}</i>`} html />
              )}
              <div className={`heroActions`}>
                <ElementReveal as={`span`} delay={0.22} className={`heroActionReveal`}>
                  <Link href={`/contact`} className={`buttonLink primary`}>
                    <ElementReveal delay={0.23}>
                      <i className={`fa-solid fa-paper-plane logoLetter`} />
                    </ElementReveal>
                    <TextReveal as={`span`} className={`logoLetter`} text={`Get In Touch`} delay={0.24} />
                  </Link>
                </ElementReveal>
                <ElementReveal as={`span`} delay={0.28} className={`heroActionReveal`}>
                  <Link href={`/projects`} className={`buttonLink ghost`}>
                    <ElementReveal delay={0.29}>
                      <i className={`fa-solid fa-diagram-project gradientTextColor logoLetter`} />
                    </ElementReveal>
                    <TextReveal as={`span`} className={`logoLetter`} text={`Our Work`} delay={0.3} />
                  </Link>
                </ElementReveal>
              </div>
            </>
          }
          end={
            <ElementReveal as={`div`} delay={0.26} y={16} className={`heroBrand`}>
              <div onClick={scrollToElement} className={`heroLogoPlate`}>
                <Logo fullSword className={`heroLogo`} />
                <div className={`wordLogoHome`}>
                  <Word className={`wordLogoHomeGraphic`} gradient={false} arrows gradientSword />
                </div>
              </div>
              <div className={`heroMiniStats`}>
                {config?.stats?.map((stat: any, index: any) => (
                  <span className={`heroMiniStat`} key={stat.label}>
                    <TextReveal as={`strong`} className={`gradientTextColor`} text={stat.value} delay={0.39 + index * 0.06} />
                    <TextReveal as={`i`} text={width <= 768 ? (stat?.title ?? stat?.label) : stat?.label} delay={0.42 + index * 0.06} />
                  </span>
                ))}
              </div>
            </ElementReveal>
          }
        />
      </section>

      <div id={`anchor`} className={`sep reveal`} />

      {/* <section className={`pageSection specialtiesSection`}>
        <div className={`sectionInner backendGrid`}>
          <div className={`sectionTitle`}>
            <TextReveal scroll as={`span`} className={`eyebrow`} text={`Specialties`} delay={0.4} />
            <TextReveal scroll as={`h2`} text={`Our studio <span class="slashes">//</span><br> specializes in technologies<span class="slashes">:</span>`} html delay={0.06} />
            <TextReveal scroll as={`p`} text={`
              Python, JSON, SQL, REST, Firebase, WordPress/MySQL, Shopify thinking, auth, and responsive UI are organized as a real app foundation instead of a one-off portfolio page.
            `} />
          </div>
          <div className={`capabilityGrid reveal`}>
            {config.capabilities.map((capability: any) => {
              const meta = getTechnologyMeta(capability);
              return (
                <ElementReveal as={`span`} key={capability}>
                  <i className={`${meta.icon} techIcon ${meta.className}`} />
                  <TextReveal scroll as={`strong`} text={capability} />
                </ElementReveal>
              );
            })}
          </div>
        </div>
      </section>

      <div className={`sep reveal`} /> */}

      {/* {(isMounted && isChromeOrAdvancedDevice) && (
        <Section className={`homeProjects`} inversed />
      )} */}

      {/* <section className={`pageSection skillsSection`}>
        <div className={`sectionInner`}>
          <div className={`sectionTitle`}>
            <TextReveal scroll as={`span`} className={`eyebrow`} text={`Skills`} delay={0.4} />
            <TextReveal scroll as={`h2`} text={`Skills <span class="slashes">//</span> Technologies`} html delay={0.06} />
          </div>
          <div className={`skillsGrid`}>
            {config.skills.map((skill: any) => {
              const meta = getTechnologyMeta(skill.label);
              return (
                <article key={skill.label} className={`skillTile reveal`}>
                  <i className={`${skill.icon || meta.icon} techIcon ${meta.className}`} />
                  <TextReveal scroll as={`span`} className={`gradientTextColor`} text={skill.group} />
                  <TextReveal scroll as={`strong`} text={skill.label} delay={0.06} />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <div className={`sep reveal`} /> */}

      <HomeServiceEstimator />
      <HomeLandingSections />
      <HomeProjectVoyageSlider />
      <HomeCapabilityRadar />
      <HomeProjectBento />
      <HomeManifestoReveal />
      {/* <HomeVoyageMetrics /> */}

      <section className={`pageSection servicesSection`}>
        <div className={`sectionInner`}>
          <div className={`sectionTitle`}>
            <TextReveal scroll as={`span`} className={`eyebrow`} text={`Services`} delay={0.4} />
            <TextReveal scroll as={`h2`} text={`Useful enough for clients, sharp enough for hiring teams`} delay={0.06} />
          </div>
          <div className={`serviceGrid`}>
            {config.services.map((service: any) => (
              <article key={service.title} className={`serviceCard reveal`}>
                <i className={`${service.icon} gradientTextColor reveal`} />
                <TextReveal scroll as={`h3`} html text={`<i>${service.title}</i>`} />
                <TextReveal scroll as={`p`} text={service.text} />
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className={`sep reveal`} />

      <section className={`pageSection contactSection reveal cta`}>
        <ElementReveal as={`div`} delay={0.35} y={16} className={`sectionInner contactBand`}>
          <div className={`ctaOuterRow flex gap16 spaceBetween alignCenter`}>
            <div className={`ctaOuterColumn flex gap16 column`}>
              <TextReveal scroll as={`span`} className={`eyebrow`} text={`Start`} delay={0.4} />
              <TextReveal scroll as={`h2`} text={`Ready for the next version?`} delay={0.06} />
              <div className={`ctaRow flex gap16 spaceBetween alignCenter`}>
                <div className={`ctaColumn flex gap16 column`}>
                  <TextReveal scroll as={`p`} html text={`<i>Join us as we turn your vision into a reality.</i>`} />
                  <ElementReveal as={`span`} delay={0.45} className={`heroActionReveal`}>
                    <Link href={`mailto:${config.contactEmail}`} className={`buttonLink primary`}>
                      <ElementReveal delay={0.46}>
                        <i className={`fa-solid fa-paper-plane logoLetter`} />
                      </ElementReveal>
                      <TextReveal as={`span`} className={`logoLetter`} text={config?.contactEmail} delay={0.47} />
                    </Link>
                  </ElementReveal>
                </div>
              </div>
            </div>
            <div className={`ctaOuterColumn flex gap16 column`}>
              <ElementReveal as={`span`} delay={0.45} className={`heroActionReveal`}>
                <AuthWidget defaultOpen />
              </ElementReveal>
            </div>
          </div>
        </ElementReveal>
      </section>

      <div className={`sep reveal`} />
    </>
  );
}
