'use client';

import { config } from '@/shared/config/config';
import Slider from '@/app/components/slider/slider';
import ElementReveal from '@/app/components/effects/element-reveal';

type TopBarProps = {
  id?: string;
  autoplay?: boolean;
  fadeSides?: boolean;
  pauseonhover?: boolean;
  direction?: `rtl` | `ltr`;
};

export default function TopBar({
  autoplay = true,
  direction = `rtl`,
  fadeSides = true,
  pauseonhover = true,
  id = `topBarComponent`,
}: TopBarProps = {}) {
  const items = config?.topBarItems;

  return (
    <Slider
      id={id}
      role={`list`}
      autoplay={autoplay}
      direction={direction}
      pauseonhover={pauseonhover}
      trackClassName={`topBarTrack`}
      ariaLabel={`Piratechs highlights`}
      className={`topBar ${fadeSides ? `fadeSides` : ``}`}
    >
      {items?.map((item: any, index: number) => (
        <ElementReveal
          as={`span`}
          blur={false}
          duration={0.2}
          role={`listitem`}
          delay={0.5 + index * 0.012}
          key={`${item.text}-${index}`}
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
