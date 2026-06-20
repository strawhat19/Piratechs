'use client';

import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import TextReveal from '@/app/components/effects/text-reveal';
import ElementReveal from '@/app/components/effects/element-reveal';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { isLabLoaderDone, labLoaderDoneEvent } from '../../lab-loader-events';

// Page served at /playground (rewritten to /pages/playground in next.config).
// It renders inside (lab)/layout.tsx only — completely isolated from the main
// site's header, footer, and theme. The intro reveals are gated on `ready` so
// they begin only once LabLoader has slid away. Below the hero are extra scroll
// sections whose reveals use `onScroll`, so they replay on every re-entry.
export default function PlaygroundPage() {
    const [ready, setReady] = useState(false);
    const titleRef = useRef<HTMLHeadingElement | null>(null);

    // Hold the reveals until the loader finishes; if it already has (e.g. a soft
    // navigation within the lab where the loader does not re-run), start now.
    useEffect(() => {
        if (isLabLoaderDone()) {
            setReady(true);
            return;
        }
        const onDone = () => setReady(true);
        window.addEventListener(labLoaderDoneEvent, onDone, { once: true });
        return () => window.removeEventListener(labLoaderDoneEvent, onDone);
    }, []);

    useLayoutEffect(() => {
        if (!ready || !titleRef.current) return;

        gsap.registerPlugin(SplitText);

        const ctx = gsap.context(() => {
            const split = new SplitText(titleRef.current, {
                type: 'chars',
                charsClass: 'splitChar',
            });

            gsap.from(split.chars, {
                yPercent: 120,
                duration: 0.8,
                stagger: 0.035,
                ease: 'power4.out',
            });

            return () => split.revert();
        }, titleRef);

        return () => ctx.revert();
    }, [ready]);

  return (
    <main>
        {ready && (
            <>
                <section className={`labSection`}>
                    <div className={`labStack`}>
                        <h1 ref={titleRef} className={`splitTextElem heroTitle`}>
                            Design // Develop
                        </h1>
                        <TextReveal as={`h2`} text={`Full-Stack`} byLetter slide className={`splitTextElem`} delay={0.44} />
                        <TextReveal as={`h3`} text={`Applications`} byLetter slide className={`splitTextElem`} delay={0.88} />
                    </div>
                    <span className={`labScrollHint`}>Scroll &darr;</span>
                </section>

                <section className={`labSection`}>
                    <TextReveal as={`h2`} text={`Scroll // Down`} byLetter slide onScroll className={`splitTextElem`} />
                    <ElementReveal as={`p`} className={`labLead`} onScroll blur y={24}>
                        Every heading and block past the hero replays its reveal each time it
                        re-enters the viewport. Scroll up and back down to watch them run again.
                    </ElementReveal>
                </section>

                <section className={`labSection`}>
                    <TextReveal as={`h2`} text={`Replays // On Entry`} byLetter slide onScroll className={`splitTextElem`} />
                    <div className={`labCardRow`}>
                        <ElementReveal as={`div`} className={`labCard`} onScroll slide y={32} delay={0}>
                            <h4>Composable</h4>
                            <p>Drop the same component anywhere and it animates into place on demand.</p>
                        </ElementReveal>
                        <ElementReveal as={`div`} className={`labCard`} onScroll slide y={32} delay={0.12}>
                            <h4>Repeatable</h4>
                            <p>The onScroll prop re-arms the reveal so it plays on every entry.</p>
                        </ElementReveal>
                        <ElementReveal as={`div`} className={`labCard`} onScroll slide y={32} delay={0.24}>
                            <h4>Lightweight</h4>
                            <p>One IntersectionObserver per element, reset cleanly when it leaves.</p>
                        </ElementReveal>
                    </div>
                </section>

                <section className={`labSection`}>
                    <TextReveal as={`h2`} text={`Every // Time`} byLetter slide onScroll className={`splitTextElem`} />
                    <ElementReveal as={`p`} className={`labLead`} onScroll y={24}>
                        Leave onScroll off (the default) and a reveal plays just once, exactly as
                        it did before.
                    </ElementReveal>
                </section>

                <section className={`labSection`}>
                    <TextReveal as={`h3`} text={`End // Of Lab`} byLetter slide onScroll className={`splitTextElem`} />
                </section>
            </>
        )}
    </main>
  );
}

