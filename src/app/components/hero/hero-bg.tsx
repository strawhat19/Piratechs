'use client';

import HeroCircuitOverlay from './hero-circuit-overlay';
import { useGlobalContext } from '@/shared/global-context';

export { heroCircuitRevealCompleteEvent } from './hero-circuit-overlay';

export default function HeroBg() {
  const { slantedSignalLines } = useGlobalContext();

  return (
    <div className={`heroBgClip`}>
      <div className={`heroBg`}>
        <HeroCircuitOverlay />
        <span className={`gridPlane gridPlaneA`} />
        <span className={`gridPlane gridPlaneB`} />
        <span className={`signalLine signalLineA${slantedSignalLines ? ` slanted` : ``}`} />
        <span className={`signalLine signalLineB${slantedSignalLines ? ` slanted` : ``}`} />
      </div>
    </div>
  );
}
