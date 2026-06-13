'use client';

import gsap from 'gsap';
import { useLayoutEffect, useRef } from 'react';
import { markLabLoaderDone } from './lab-loader-events';

// Initial center depth of the panel's bottom curve, in SVG viewBox units
// (0–100, stretched to fill `.labLoaderCurve`). It eases to 0 as the panel
// slides up, so the trailing edge starts curved and straightens out.
const CURVE_DEPTH = 50;
const curvePathFor = (depth: number) => `M0,0 L100,0 Q50,${(depth * 2).toFixed(3)} 0,0 Z`;

// Full-screen loader for the (lab) sandbox: a counter ramps to 100% with a
// velocity-driven vertical motion blur (digits smear while counting fast and
// sharpen as they settle), then the whole overlay slides up out of view.
// Self-contained — delete the <LabLoader /> line in layout.tsx to disable it.
export default function LabLoader() {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const countRef = useRef<HTMLSpanElement | null>(null);
  const blurRef = useRef<SVGFEGaussianBlurElement | null>(null);
  const curvePathRef = useRef<SVGPathElement | null>(null);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    const count = countRef.current;
    const blurNode = blurRef.current;
    const curvePath = curvePathRef.current;
    if (!overlay || !count || !blurNode || !curvePath) return;

    const progress = { value: 0 };
    let lastValue = 0;
    let lastTime = performance.now();
    let blur = 0;

    // The panel's bottom edge bulges downward, then flattens as it slides away.
    const curve = { depth: CURVE_DEPTH };
    const applyCurve = () => curvePath.setAttribute(`d`, curvePathFor(curve.depth));
    applyCurve();

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
        // Slow, smooth slide-up tuned to match the page's text-reveal pacing.
        .addLabel(`slide`, `+=0.15`)
        .to(
          overlay,
          {
            yPercent: -100,
            duration: 1.35,
            ease: `power3.inOut`,
          },
          `slide`,
        )
        // Flatten the curved bottom edge in step with the slide: hold the curve
        // through most of the travel, then straighten out toward the end.
        .to(
          curve,
          {
            depth: 0,
            duration: 1.35,
            ease: `power2.in`,
            onUpdate: applyCurve,
          },
          `slide`,
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
      <svg
        className={`labLoaderCurve`}
        viewBox={`0 0 100 100`}
        preserveAspectRatio={`none`}
        aria-hidden={true}
        focusable={false}
      >
        <path ref={curvePathRef} d={curvePathFor(CURVE_DEPTH)} fill={`#fff`} />
      </svg>
    </div>
  );
}
