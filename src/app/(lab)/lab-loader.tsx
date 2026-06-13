'use client';

import gsap from 'gsap';
import { useLayoutEffect, useRef } from 'react';
import { markLabLoaderDone } from './lab-loader-events';

// Simple full-screen loader for the (lab) sandbox: a counter ramps to 100% and
// then the whole overlay slides up out of view, revealing the page beneath.
// Self-contained — delete the <LabLoader /> line in layout.tsx to disable it.
export default function LabLoader() {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const countRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const count = countRef.current;
    if (!overlay || !count) return;

    const progress = { value: 0 };

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .to(progress, {
          value: 100,
          duration: 1.6,
          ease: `power2.inOut`,
          onUpdate: () => {
            count.textContent = String(Math.round(progress.value));
          },
        })
        .to(
          overlay,
          {
            yPercent: -100,
            duration: 0.8,
            ease: `power4.inOut`,
          },
          `+=0.15`,
        )
        .set(overlay, { display: `none` })
        // Tell the page the loader is gone so it can start its intro reveals.
        .add(markLabLoaderDone);
    }, overlay);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={overlayRef} className={`labLoader`}>
      <span className={`labLoaderCount`}>
        <span ref={countRef}>0</span>%
      </span>
    </div>
  );
}
