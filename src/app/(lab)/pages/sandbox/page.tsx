'use client';

import { useEffect, useState } from 'react';
import ElementReveal from '@/app/components/effects/element-reveal';
import TextReveal from '@/app/components/effects/text-reveal';
import { isLabLoaderDone, labLoaderDoneEvent } from '../../lab-loader-events';

// Second lab page, served at /sandbox (rewritten to /pages/sandbox in
// next.config). It exists so you can navigate between two pages inside the
// (lab) layout and observe the LabLoader's behaviour: the loader runs on the
// first hard load of any lab page, but does NOT replay on soft (client-side)
// navigation between lab pages — the layout (and therefore the loader) persists,
// and `isLabLoaderDone()` is already true, so the reveals here start immediately
// when you arrive from /playground.
export default function SandboxPage() {
  const [ready, setReady] = useState(false);

  // Mirror the playground gate: wait for the loader on a fresh load, but start
  // right away on a soft navigation where the loader has already finished.
  useEffect(() => {
    if (isLabLoaderDone()) {
      setReady(true);
      return;
    }
    const onDone = () => setReady(true);
    window.addEventListener(labLoaderDoneEvent, onDone, { once: true });
    return () => window.removeEventListener(labLoaderDoneEvent, onDone);
  }, []);

  if (!ready) return <main />;

  return (
    <main>
      <section className={`labSection`}>
        <div className={`labStack`}>
          <TextReveal as={`h1`} text={`Sandbox`} byLetter slide className={`splitTextElem heroTitle`} />
          <TextReveal as={`h3`} text={`Second // Page`} byLetter slide className={`splitTextElem`} delay={0.44} />
        </div>
        <span className={`labScrollHint`}>Scroll &darr;</span>
      </section>

      <section className={`labSection`}>
        <TextReveal as={`h2`} text={`No // Loader`} byLetter slide onScroll className={`splitTextElem`} />
        <ElementReveal as={`p`} className={`labLead`} onScroll blur y={24}>
          You reached this page without the counter replaying. The loader lives in
          the lab layout, which persists across in-lab navigation, so it only runs
          on the first load or a full refresh.
        </ElementReveal>
      </section>

      <section className={`labSection`}>
        <TextReveal as={`h2`} text={`Refresh // To Replay`} byLetter slide onScroll className={`splitTextElem`} />
        <ElementReveal as={`p`} className={`labLead`} onScroll y={24}>
          Hard-refresh this URL (or open it in a new tab) and the loader counts up
          again before this content slides in.
        </ElementReveal>
      </section>
    </main>
  );
}
