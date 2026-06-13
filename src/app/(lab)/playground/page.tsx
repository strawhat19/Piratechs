'use client';

import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import TextReveal from '@/app/components/effects/text-reveal';
import { isLabLoaderDone, labLoaderDoneEvent } from '../lab-loader-events';

// Blank page served at /playground. It renders inside (lab)/layout.tsx only —
// completely isolated from the main site's header, footer, and theme. The intro
// reveals are gated on `ready` so they begin only once LabLoader has slid away.
export default function PlaygroundPage() {
    const titleRef = useRef<HTMLHeadingElement | null>(null);
    const [ready, setReady] = useState(false);

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
    <main
      style={{
        display: `flex`,
        minHeight: `100dvh`,
        alignItems: `center`,
        justifyContent: `center`,
      }}
    >
        {ready && (
            <div style={{ display: `flex`, flexDirection: `column`, gap: 5 }}>
                <h1 ref={titleRef} className={`splitTextElem heroTitle`}>
                    Design // Develop
                </h1>
                <TextReveal as={`h2`} text={`Full-Stack`} byLetter slide className={`splitTextElem`} delay={0.44} />
                <TextReveal as={`h3`} text={`Applications`} byLetter slide className={`splitTextElem`} delay={0.88} />
            </div>
        )}
    </main>
  );
}
