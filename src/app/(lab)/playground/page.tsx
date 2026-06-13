'use client';

// Blank page served at /playground. It renders inside (lab)/layout.tsx only —
// completely isolated from the main site's header, footer, and theme. Replace

import gsap from 'gsap';
// import { Button } from '@mui/material';
import { SplitText } from 'gsap/SplitText';
import { useLayoutEffect, useRef } from 'react';

// everything below with your experimental layout.
export default function PlaygroundPage() {
    const titleRef = useRef<HTMLHeadingElement | null>(null);

    useLayoutEffect(() => {
        if (!titleRef.current) return;

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
    }, []);

  return (
    <main
      style={{
        display: `flex`,
        minHeight: `100dvh`,
        alignItems: `center`,
        justifyContent: `center`,
      }}
    >
        <h1 ref={titleRef} className="heroTitle">
            Design // Develop
        </h1>
        {/* <Button onClick={() => alert('Hello from the playground!')}>
            Click Me
        </Button> */}
      {/* <p>
        Playground — blank canvas at <code>/playground</code>
      </p> */}
    </main>
  );
}
