'use client';

import { config } from '@/shared/config/config';
import Slider from '@/app/components/slider/slider';
import ElementReveal from '@/app/components/effects/element-reveal';

type TopBarProps = {
  autoplay?: boolean;
  pauseonhover?: boolean;
};

export default function TopBar({
  autoplay = true,
  pauseonhover = true,
}: TopBarProps = {}) {
  const items = config.topBarItems;

  return (
    <Slider
      role={`list`}
      autoplay={autoplay}
      className={`topBar`}
      pauseonhover={pauseonhover}
      trackClassName={`topBarTrack`}
      ariaLabel={`Piratechs highlights`}
    >
      {items.map((item, index) => (
        <ElementReveal
          as={`span`}
          blur={false}
          duration={0.2}
          role={`listitem`}
          key={`${item.text}-${index}`}
          delay={0.5 + index * 0.012}
          className={`topBarItem buttonHoverBorder`}
        >
          <i className={`${item.icon} gradientTextColor`} />
          {item.label ? <strong>{item.label}</strong> : null}
          <span>{item.text}</span>
        </ElementReveal>
      ))}
    </Slider>
  );
}
