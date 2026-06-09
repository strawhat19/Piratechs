'use client';

import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { useGlobalContext } from '@/shared/global-context';
import { advancedGraphics } from '@/shared/common/scripts/globals';
import { advancedDevice } from '@/shared/common/database/constants';

type HeroCircuitOverlayProps = {
  blur?: boolean;
  blendMode?: boolean;
  breathing?: boolean;
  energySweep?: boolean;
  animatePulses?: boolean;
  showCircuitOverlay?: boolean;
  revealSlant?: boolean | number;
};

export default function HeroCircuitOverlay({ 
  revealSlant = false,
  energySweep = false,
  blur = advancedGraphics, 
  blendMode = advancedGraphics, 
  breathing = advancedGraphics,
  animatePulses = advancedGraphics, 
  showCircuitOverlay = advancedDevice,
}: HeroCircuitOverlayProps) {
  const { isPWA, platform } = useGlobalContext();

  const [isMounted, setIsMounted] = useState(false);

  const overlayRef = useRef<SVGSVGElement | null>(null);
  const overlayWrapRef = useRef<HTMLSpanElement | null>(null);

  const glowFilter = blur ? `url(#piratechsCircuitGlow)` : undefined;
  const numericSlant = typeof revealSlant === `number` && Number.isFinite(revealSlant) 
    ? revealSlant 
    : revealSlant ? 90 : 0;
  const revealSlantAmount = Math.max(-32, Math.min(32, numericSlant));

  const isChromeOrPwaDevice = isMounted && Boolean(
    !isPWA && (platform && platform?.chrome && !platform?.mobile && !platform?.ios && (
      !platform?.os?.toLowerCase()?.includes(`mac`)
    ) || (
      platform?.os?.toLowerCase()?.includes(`windows`)
    ))
  );

  const shouldRenderCircuit = showCircuitOverlay && isChromeOrPwaDevice;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!overlayWrapRef.current || !shouldRenderCircuit) return;

    const ctx = gsap.context(() => {
      const slantAbs = Math.abs(revealSlantAmount);

      if (revealSlantAmount) {
        gsap.fromTo(
          overlayWrapRef.current,
          {
            '--heroCircuitReveal': `${-slantAbs}%`,
            clipPath: `polygon(0 0, calc(var(--heroCircuitReveal) + var(--heroCircuitRevealSlant)) 0, calc(var(--heroCircuitReveal) - var(--heroCircuitRevealSlant)) 100%, 0 100%)`,
            '--heroCircuitRevealSlant': `${revealSlantAmount}%`,
          },
          {
            // delay: 0.5,
            // delay: 1.22,
            duration: 1.75,
            ease: `power3.in`,
            '--heroCircuitReveal': `${100 + slantAbs}%`,
          }
        );
        return;
      }

      gsap.fromTo(
        overlayWrapRef.current,
        {
          clipPath: `inset(0 100% 0 0 round 22px)`,
        },
        {
          delay: 0.5,
          // delay: 1.22,
          duration: 1.75,
          ease: `power3.in`,
          clipPath: `inset(0 0% 0 0 round 22px)`,
        }
      );
    }, overlayWrapRef);

    return () => {
      ctx.revert();
    }
  }, [revealSlantAmount, shouldRenderCircuit]);

  return shouldRenderCircuit ? (
    <span ref={overlayWrapRef} className={`heroCircuitOverlayClip`}>
      <svg
        ref={overlayRef}
        aria-hidden={`true`}
        viewBox={`0 0 1440 760`}
        data-blur={blur ? `true` : `false`}
        preserveAspectRatio={`xMidYMid slice`}
        data-blend-mode={blendMode ? `true` : `false`}
        data-animate-pulses={animatePulses ? `true` : `false`}
        className={`heroCircuitOverlay ${breathing ? `breathing` : ``}`}
      >
      {blur ? (
        <defs>
          <filter id={`piratechsCircuitGlow`} x={`-20%`} y={`-40%`} width={`140%`} height={`180%`} colorInterpolationFilters={`sRGB`}>
            <feGaussianBlur stdDeviation={`3.5`} result={`blur`} />
            <feMerge>
              <feMergeNode in={`blur`} />
              <feMergeNode in={`SourceGraphic`} />
            </feMerge>
          </filter>
        </defs>
      ) : null}

      <g className={`circuitLayer circuitLayerBack`}>
        <path className={`circuitTrace`} d={`M-60 208 H164 L232 140 H364 L428 204 H566 L642 128 H812 L888 208 H1048 L1120 164 H1244 L1310 208 H1510`} />
        <path className={`circuitTrace tight`} d={`M-60 232 H152 L220 164 H352 L416 228 H554 L630 152 H800 L876 232 H1036 L1108 188 H1256 L1322 232 H1510`} />
        <path className={`circuitTrace tight`} d={`M-50 554 H236 L302 488 H498 L566 556 H750 L832 474 H1084 L1160 398 H1510`} />
        <path className={`circuitTrace`} d={`M-50 578 H248 L314 512 H486 L554 580 H762 L844 498 H1096 L1172 422 H1510`} />
        <path className={`circuitTrace tight`} d={`M-50 602 H260 L326 536 H474 L542 604 H774 L856 522 H1108 L1184 448 H1510`} />
        <path className={`circuitTrace tight`} d={`M-50 414 H144 L214 484 H360 L448 396 H648 L726 474 H914 L1002 414 H1160 L1230 472 H1510`} />
        <path className={`circuitTrace`} d={`M-50 438 H132 L202 508 H372 L460 420 H636 L714 498 H926 L1014 438 H1172 L1242 496 H1510`} />
        <path className={`circuitTrace tight`} d={`M-50 462 H120 L190 532 H384 L472 444 H624 L702 524 H938 L1026 462 H1184 L1254 520 H1510`} />
        <path className={`circuitTrace tight`} d={`M-50 144 H392 L460 96 H680 L752 144 H906 L978 200 H1094 L1172 142 H1510`} />
        <path className={`circuitTrace`} d={`M-50 632 H980 H1094 L1172 554 H1308 L1384 630 H1510`} />
        <path className={`circuitTrace tight`} d={`M-50 656 H1006 H1106 L1184 578 H1296 L1372 654 H1510`} />
      </g>

      <g className={`circuitLayer circuitLayerMain`} filter={glowFilter}>
        <path className={`circuitTrace tight`} d={`M-50 236 H184 L250 302 H380 L460 222 H662 L736 296 H900 L970 226 H1166 L1232 282 H1510`} />
        <path className={`circuitTrace strong`} d={`M-50 260 H172 L238 326 H392 L472 246 H650 L724 320 H912 L982 250 H1178 L1244 306 H1510`} />
        <path className={`circuitTrace tight`} d={`M-50 284 H160 L226 350 H404 L484 270 H638 L712 344 H924 L994 274 H1190 L1256 330 H1510`} />
        <path className={`circuitPulse pulseA`} d={`M-50 260 H172 L238 326 H392 L472 246 H650 L724 320 H912 L982 250 H1178 L1244 306 H1510`} />
        <path className={`circuitTrace tight`} d={`M-50 102 H188 L262 176 H412 L482 106 H696 L766 176 H932 L1006 102 H1140 L1210 158 H1510`} />
        <path className={`circuitTrace strong`} d={`M-50 126 H176 L250 200 H424 L494 130 H684 L754 200 H944 L1018 126 H1152 L1222 182 H1510`} />
        <path className={`circuitTrace tight`} d={`M-50 150 H164 L238 224 H436 L506 154 H672 L742 224 H956 L1030 150 H1164 L1234 206 H1510`} />
        <path className={`circuitPulse pulseB`} d={`M-50 126 H176 L250 200 H424 L494 130 H684 L754 200 H944 L1018 126 H1152 L1222 182 H1510`} />
        <path className={`circuitTrace tight`} d={`M-50 632 H284 L352 564 H540 L624 648 H796 L880 564 H1076 L1140 628 H1510`} />
        <path className={`circuitTrace strong`} d={`M-50 656 H296 L364 588 H528 L612 672 H808 L892 588 H1064 L1128 652 H1510`} />
        <path className={`circuitTrace tight`} d={`M-50 680 H308 L376 612 H516 L600 696 H820 L904 612 H1052 L1116 676 H1510`} />
        <path className={`circuitPulse pulseC`} d={`M-50 656 H296 L364 588 H528 L612 672 H808 L892 588 H1064 L1128 652 H1510`} />
        <path className={`circuitTrace tight`} d={`M-50 196 H356 L424 148 H650 L722 196 H1022 H1180 L1240 256 H1350 L1404 202 H1510`} />
        <path className={`circuitTrace strong`} d={`M-50 214 H368 L436 166 H638 L710 214 H1038 H1168 L1228 274 H1362 L1416 220 H1510`} />
        <path className={`circuitTrace tight`} d={`M-50 232 H380 L448 184 H626 L698 232 H1054 H1156 L1216 292 H1374 L1428 238 H1510`} />
      </g>

      <g className={`circuitNodes`} filter={glowFilter}>
        <circle className={`circuitNode nodeA`} cx={`172`} cy={`260`} r={`5`} />
        <circle className={`circuitNode nodeB`} cx={`238`} cy={`326`} r={`6`} />
        <circle className={`circuitNode nodeC`} cx={`472`} cy={`246`} r={`4`} />
        <circle className={`circuitNode nodeD`} cx={`724`} cy={`320`} r={`6`} />
        <circle className={`circuitNode nodeE`} cx={`982`} cy={`250`} r={`5`} />
        <circle className={`circuitNode nodeF`} cx={`250`} cy={`200`} r={`5`} />
        <circle className={`circuitNode nodeG`} cx={`754`} cy={`200`} r={`5`} />
        <circle className={`circuitNode nodeH`} cx={`1228`} cy={`274`} r={`6`} />
        <circle className={`circuitNode nodeI`} cx={`364`} cy={`588`} r={`5`} />
        <circle className={`circuitNode nodeJ`} cx={`892`} cy={`588`} r={`5`} />
      </g>
      </svg>

      {energySweep ? (
        <span className={`heroCircuitEnergyLayer`} aria-hidden={`true`}>
          <span className={`heroCircuitEnergy heroCircuitEnergyA`} />
          <span className={`heroCircuitEnergy heroCircuitEnergyB`} />
          <span className={`heroCircuitEnergy heroCircuitEnergyC`} />
        </span>
      ) : null}
    </span>
  ) : null;
}
