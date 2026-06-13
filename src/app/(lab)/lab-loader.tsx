'use client';

import gsap from 'gsap';
import { useLayoutEffect, useRef } from 'react';
import { markLabLoaderDone } from './lab-loader-events';

// Full-screen loader for the (lab) sandbox: a counter ramps to 100% with a
// velocity-driven vertical motion blur (digits smear while counting fast and
// sharpen as they settle), then the whole overlay slides up out of view.
// Self-contained — delete the <LabLoader /> line in layout.tsx to disable it.
export default function LabLoader() {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const countRef = useRef<HTMLSpanElement | null>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement | null>(null);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const count = countRef.current;
    const blurNode = blurRef.current;
    if (!overlay || !count || !blurNode) return;

    const progress = { value: 0 };
    let lastValue = 0;
    let lastTime = performance.now();
    let blur = 0;

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .to(progress, {
          value: 100,
          duration: 1.8,
          ease: `power3.inOut`,
          onUpdate: () => {
            const now = performance.now();
            const dt = Math.max(now - lastTime, 1) / 1000; // seconds
            const velocity = Math.abs(progress.value - lastValue) / dt; // %/sec
            // Map counting speed to a vertical blur, smoothing frame-to-frame
            // jitter so the smear ramps up and eases off like real motion blur.
            const target = gsap.utils.clamp(0, 7, velocity * 0.05);
            blur += (target - blur) * 0.35;
            blurNode.setAttribute(`stdDeviation`, `0 ${blur.toFixed(2)}`);
            count.textContent = String(Math.round(progress.value));
            lastValue = progress.value;
            lastTime = now;
          },
          onComplete: () => blurNode.setAttribute(`stdDeviation`, `0 0`),
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
      <svg className={`labLoaderFilter`} aria-hidden={true} focusable={false}>
        <defs>
          <filter id={`labMotionBlur`} x={`-50%`} y={`-50%`} width={`200%`} height={`200%`} colorInterpolationFilters={`sRGB`}>
            <feGaussianBlur ref={blurRef} in={`SourceGraphic`} stdDeviation={`0 0`} />
          </filter>
        </defs>
      </svg>
      <span className={`labLoaderCount`}>
        <span ref={countRef}>0</span>%
      </span>
    </div>
  );
}
