'use client';

import { Children, Fragment, cloneElement, isValidElement, useEffect, useRef, useState, type AriaRole, type ReactElement, type ReactNode } from 'react';

type SliderProps = {
  role?: AriaRole;
  speed?: number;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  autoplay?: boolean;
  pauseonhover?: boolean;
  trackClassName?: string;
  direction?: `rtl` | `ltr`;
  draggingClassName?: string;
};

export default function Slider({
  role,
  children,
  className,
  ariaLabel,
  speed = 15,
  trackClassName,
  autoplay = true,
  direction = `rtl`,
  pauseonhover = true,
  draggingClassName = `isDragging`,
}: SliderProps) {
  const inViewRef = useRef(true);
  const dragStartXRef = useRef(0);
  const hoveringRef = useRef(false);
  const draggingRef = useRef(false);
  const dragStartTimeRef = useRef(0);
  const playStateFrameRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const animationRef = useRef<Animation | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const [dragging, setDragging] = useState(false);

  const shouldPlayAnimation = () => (
    autoplay && inViewRef.current && !document.hidden && !draggingRef.current && !(pauseonhover && hoveringRef.current) && !reducedMotionRef.current
  );

  const easeInOutCubic = (value: number) => (
    value < 0.5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2
  );

  const tweenPlaybackRate = (targetRate: number, immediate = false) => {
    const animation = animationRef.current;
    if (animation == null) return;
    window.cancelAnimationFrame(playStateFrameRef.current);
    if (immediate) {
      animation.playbackRate = targetRate;
      if (targetRate > 0) animation.play();
      if (targetRate == 0) animation.pause();
      return;
    }
    const visualTargetRate = targetRate == 0 ? 0.001 : targetRate;
    const startRate = Math.max(animation.playbackRate || 0.001, 0.001);
    const startTime = window.performance.now();
    const duration = targetRate == 0 ? 520 : 180;
    if (targetRate > 0) {
      animation.playbackRate = Math.max(animation.playbackRate || 0.001, 0.001);
      animation.play();
    }
    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      animation.playbackRate = startRate + (visualTargetRate - startRate) * easeInOutCubic(progress);
      if (progress < 1) {
        playStateFrameRef.current = window.requestAnimationFrame(tick);
        return;
      }
      animation.playbackRate = targetRate;
      if (targetRate == 0) animation.pause();
    };
    playStateFrameRef.current = window.requestAnimationFrame(tick);
  };

  const updatePlayState = () => {
    const animation = animationRef.current;
    if (animation == null) return;
    if (shouldPlayAnimation()) {
      tweenPlaybackRate(1);
    } else {
      tweenPlaybackRate(0);
    }
  };

  useEffect(() => {
    const track = trackRef.current;
    if (track == null || typeof track.animate !== `function`) return;

    reducedMotionRef.current = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;

    const getDuration = () => {
      const timing = animationRef.current?.effect?.getComputedTiming();
      return typeof timing?.duration === `number` ? timing.duration : 0;
    };

    const getCurrentTime = () => {
      const current = animationRef.current?.currentTime;
      return typeof current === `number` ? current : 0;
    };

    const buildAnimation = () => {
      const previous = animationRef.current;
      let progress = 0;
      if (previous != null) {
        const previousDuration = getDuration();
        if (previousDuration > 0) {
          progress = (getCurrentTime() % previousDuration) / previousDuration;
        }
        previous.cancel();
      }

      const setWidth = track.scrollWidth / 2;
      if (setWidth <= 0) return;

      const duration = (setWidth / speed) * 1000;
      const keyframes = direction == `ltr`
        ? [
          { transform: `translate3d(-${setWidth}px, 0, 0)` },
          { transform: `translate3d(0, 0, 0)` },
        ]
        : [
          { transform: `translate3d(0, 0, 0)` },
          { transform: `translate3d(-${setWidth}px, 0, 0)` },
        ];
      const animation = track.animate(
        keyframes,
        { duration, iterations: Infinity, easing: `linear` },
      );
      animation.currentTime = progress * duration;
      animationRef.current = animation;
      updatePlayState();
    };

    buildAnimation();

    const observer = new IntersectionObserver(
      entries => {
        inViewRef.current = entries?.[0]?.isIntersecting ?? true;
        updatePlayState();
      },
      { threshold: 0 },
    );
    observer.observe(track);

    const onVisibilityChange = () => updatePlayState();
    document.addEventListener(`visibilitychange`, onVisibilityChange);

    let resizeFrame = 0;
    const onResize = () => {
      window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(buildAnimation);
    };
    window.addEventListener(`resize`, onResize);

    return () => {
      observer.disconnect();
      document.removeEventListener(`visibilitychange`, onVisibilityChange);
      window.removeEventListener(`resize`, onResize);
      window.cancelAnimationFrame(resizeFrame);
      window.cancelAnimationFrame(playStateFrameRef.current);
      animationRef.current?.cancel();
      animationRef.current = null;
    };
  }, [autoplay, direction, pauseonhover, speed]);

  const onMouseEnter = () => {
    hoveringRef.current = true;
    updatePlayState();
  };

  const onMouseLeave = () => {
    hoveringRef.current = false;
    updatePlayState();
  };

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const animation = animationRef.current;
    if (animation == null) return;
    draggingRef.current = true;
    setDragging(true);
    dragStartXRef.current = event.clientX;
    const current = animation.currentTime;
    dragStartTimeRef.current = typeof current === `number` ? current : 0;
    tweenPlaybackRate(0, true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const animation = animationRef.current;
    const track = trackRef.current;
    if (animation == null || track == null) return;
    const timing = animation.effect?.getComputedTiming();
    const duration = typeof timing?.duration === `number` ? timing.duration : 0;
    const setWidth = track.scrollWidth / 2;
    if (duration <= 0 || setWidth <= 0) return;
    const deltaX = event.clientX - dragStartXRef.current;
    const deltaTime = (deltaX / setWidth) * duration;
    let nextTime = direction == `ltr` ? dragStartTimeRef.current + deltaTime : dragStartTimeRef.current - deltaTime;
    nextTime = ((nextTime % duration) + duration) % duration;
    animation.currentTime = nextTime;
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    updatePlayState();
  };

  const renderCopy = (copy: number) => Children.map(children, (child, index) => {
    if (!isValidElement(child)) {
      return <span key={`${copy}-${index}`} aria-hidden={copy == 1 ? `true` : undefined}>{child}</span>;
    }
    const props = child.props as Record<string, unknown>;
    return cloneElement(child as ReactElement<Record<string, unknown>>, {
      key: `${copy}-${child.key ?? index}`,
      'aria-hidden': copy == 1 ? `true` : props?.[`aria-hidden`],
    });
  });

  return (
    <div className={className} aria-label={ariaLabel} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div
        role={role}
        ref={trackRef}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        className={[trackClassName, dragging ? draggingClassName : ``].filter(Boolean).join(` `)}
      >
        {[0, 1].map(copy => (
          <Fragment key={copy}>{renderCopy(copy)}</Fragment>
        ))}
      </div>
    </div>
  );
}
