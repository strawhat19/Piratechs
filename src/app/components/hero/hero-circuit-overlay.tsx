export default function HeroCircuitOverlay() {
  return (
    <svg className={`heroCircuitOverlay`} viewBox={`0 0 1440 760`} preserveAspectRatio={`xMidYMid slice`} aria-hidden={`true`}>
      <defs>
        <filter id={`piratechsCircuitGlow`} x={`-20%`} y={`-40%`} width={`140%`} height={`180%`} colorInterpolationFilters={`sRGB`}>
          <feGaussianBlur stdDeviation={`3.5`} result={`blur`} />
          <feMerge>
            <feMergeNode in={`blur`} />
            <feMergeNode in={`SourceGraphic`} />
          </feMerge>
        </filter>
      </defs>

      <g className={`circuitLayer circuitLayerBack`}>
        <path className={`circuitTrace`} d={`M-60 172 H164 L232 104 H364 L428 168 H566 L642 92 H812`} />
        <path className={`circuitTrace`} d={`M58 622 H248 L314 556 H486 L554 624 H762 L844 542 H1096 L1172 466 H1510`} />
        <path className={`circuitTrace`} d={`M-40 438 H132 L202 508 H372 L460 420 H636 L714 498 H926`} />
        <path className={`circuitTrace`} d={`M882 84 H1038 L1106 152 H1258 L1328 82 H1502`} />
        <path className={`circuitTrace`} d={`M980 676 H1094 L1172 598 H1308 L1384 674 H1504`} />
      </g>

      <g className={`circuitLayer circuitLayerMain`} filter={`url(#piratechsCircuitGlow)`}>
        <path className={`circuitTrace strong`} d={`M-50 260 H172 L238 326 H392 L472 246 H650 L724 320 H912 L982 250 H1510`} />
        <path className={`circuitPulse pulseA`} d={`M-50 260 H172 L238 326 H392 L472 246 H650 L724 320 H912 L982 250 H1510`} />
        <path className={`circuitTrace strong`} d={`M20 90 H176 L250 164 H424 L494 94 H684 L754 164 H944 L1018 90 H1218`} />
        <path className={`circuitPulse pulseB`} d={`M20 90 H176 L250 164 H424 L494 94 H684 L754 164 H944 L1018 90 H1218`} />
        <path className={`circuitTrace strong`} d={`M132 706 H296 L364 638 H528 L612 722 H808 L892 638 H1064 L1128 702 H1286`} />
        <path className={`circuitPulse pulseC`} d={`M132 706 H296 L364 638 H528 L612 722 H808 L892 638 H1064 L1128 702 H1286`} />
        <path className={`circuitTrace strong`} d={`M1038 214 H1168 L1228 274 H1362 L1416 220 H1510`} />
        <path className={`circuitPulse pulseD`} d={`M1038 214 H1168 L1228 274 H1362 L1416 220 H1510`} />
      </g>

      <g className={`circuitNodes`} filter={`url(#piratechsCircuitGlow)`}>
        <circle className={`circuitNode nodeA`} cx={`172`} cy={`260`} r={`5`} />
        <circle className={`circuitNode nodeB`} cx={`238`} cy={`326`} r={`6`} />
        <circle className={`circuitNode nodeC`} cx={`472`} cy={`246`} r={`4`} />
        <circle className={`circuitNode nodeD`} cx={`724`} cy={`320`} r={`6`} />
        <circle className={`circuitNode nodeE`} cx={`982`} cy={`250`} r={`5`} />
        <circle className={`circuitNode nodeF`} cx={`250`} cy={`164`} r={`5`} />
        <circle className={`circuitNode nodeG`} cx={`754`} cy={`164`} r={`5`} />
        <circle className={`circuitNode nodeH`} cx={`1228`} cy={`274`} r={`6`} />
        <circle className={`circuitNode nodeI`} cx={`364`} cy={`638`} r={`5`} />
        <circle className={`circuitNode nodeJ`} cx={`892`} cy={`638`} r={`5`} />
      </g>
    </svg>
  );
}
