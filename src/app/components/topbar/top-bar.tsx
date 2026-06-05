'use client';

import { config } from '@/shared/config/config';
import { useEffect, useRef, useState } from 'react';

const MARQUEE_SPEED = 15; // px per second, frame-rate independent

export default function TopBar() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<Animation | null>(null);
  const inViewRef = useRef(true);
  const reducedMotionRef = useRef(false);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartTimeRef = useRef(0);
  const [dragging, setDragging] = useState(false);

  const items = config.topBarItems;

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

    const updatePlayState = () => {
      const animation = animationRef.current;
      if (animation == null) return;
      const shouldPlay = inViewRef.current && !document.hidden && !draggingRef.current && !reducedMotionRef.current;
      if (shouldPlay) {
        animation.play();
      } else {
        animation.pause();
      }
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

      // Two identical copies sit back-to-back; one copy width is exactly half.
      const setWidth = track.scrollWidth / 2;
      if (setWidth <= 0) return;

      const duration = (setWidth / MARQUEE_SPEED) * 1000;
      const animation = track.animate(
        [
          { transform: `translate3d(0, 0, 0)` },
          { transform: `translate3d(-${setWidth}px, 0, 0)` },
        ],
        { duration, iterations: Infinity, easing: `linear` },
      );
      animation.currentTime = progress * duration;
      animationRef.current = animation;
      updatePlayState();
    };

    buildAnimation();

    const observer = new IntersectionObserver(
      entries => {
        inViewRef.current = entries[0]?.isIntersecting ?? true;
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
      animationRef.current?.cancel();
      animationRef.current = null;
    };
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const animation = animationRef.current;
    if (animation == null) return;
    draggingRef.current = true;
    setDragging(true);
    dragStartXRef.current = event.clientX;
    const current = animation.currentTime;
    dragStartTimeRef.current = typeof current === `number` ? current : 0;
    animation.pause();
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
    let nextTime = dragStartTimeRef.current - deltaTime;
    nextTime = ((nextTime % duration) + duration) % duration; // wrap into [0, duration)
    animation.currentTime = nextTime;
  };

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const animation = animationRef.current;
    if (animation != null && inViewRef.current && !document.hidden && !reducedMotionRef.current) {
      animation.play();
    }
  };

  return (
    <div className={`topBar`} aria-label={`Piratechs highlights`}>
      <div
        ref={trackRef}
        role={`list`}
        className={`topBarTrack ${dragging ? `isDragging` : ``}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        {[0, 1].map(copy =>
          items.map((item, index) => (
            <span
              role={`listitem`}
              className={`topBarItem`}
              aria-hidden={copy === 1 ? `true` : undefined}
              key={`${copy}-${item.text}-${index}`}
            >
              <i className={item.icon} />
              {item.label ? <strong>{item.label}</strong> : null}
              <span>{item.text}</span>
            </span>
          )),
        )}
      </div>
    </div>
  );
}
