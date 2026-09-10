'use client';

import { useEffect, useState } from 'react';
import TextReveal from '@/app/components/effects/text-reveal';
import ElementReveal from '@/app/components/effects/element-reveal';

const dateFormatter = new Intl.DateTimeFormat(`en-US`, {
  day: `numeric`,
  month: `short`,
  weekday: `short`,
  timeZone: `America/New_York`,
});

const clockFormatter = new Intl.DateTimeFormat(`en-US`, {
  hour: `2-digit`,
  minute: `2-digit`,
  second: `2-digit`,
  timeZoneName: `short`,
  timeZone: `America/New_York`,
});

export default function FooterClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const updateClock = () => { if (!document.hidden) setNow(new Date()); };
    updateClock();
    const interval = window.setInterval(updateClock, 1000);
    document.addEventListener(`visibilitychange`, updateClock);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener(`visibilitychange`, updateClock);
    };
  }, []);

  return (
    <ElementReveal onScroll as={`small`} delay={0.08} className={`footerClock`} title={`Atlanta local time · America/New_York`}>
      <i className={`fa-regular fa-clock gradientTextColor`} aria-hidden={`true`} />
      <TextReveal onScroll text={`ATL`} className={`footerClockCity`} />
      <time className={`footerClockData`} dateTime={now?.toISOString()}>
        <TextReveal onScroll delay={0.08} className={`footerClockDate`} text={now ? dateFormatter.format(now) : `---, --- --`} />
        <ElementReveal onScroll delay={0.14} className={`footerClockTime`}>{now ? clockFormatter.format(now) : `--:--:-- -- ---`}</ElementReveal>
      </time>
    </ElementReveal>
  );
}
