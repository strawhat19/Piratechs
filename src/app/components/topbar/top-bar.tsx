'use client';

import { useEffect, useRef, useState } from 'react';
import { siteConfig } from '@/shared/config/site';

export default function TopBar() {
  const setCount = 12;
  const frameRef = useRef<number | null>(null);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragScrollLeftRef = useRef(0);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const marqueeItems = Array.from({ length: setCount }).flatMap(() => siteConfig.topBarItems);

  const getLoopMetrics = () => {
    const scroller = scrollerRef.current;
    if (scroller == null) return null;
    const setWidth = scroller.scrollWidth / setCount;
    const center = setWidth * Math.floor(setCount / 2);
    return {
      center,
      setWidth,
      max: center + setWidth,
      min: center - setWidth,
    };
  };

  const normalizeScroll = () => {
    const scroller = scrollerRef.current;
    const metrics = getLoopMetrics();
    if (scroller == null || metrics == null || metrics.setWidth <= 0) return;
    if (scroller.scrollLeft >= metrics.max) {
      scroller.scrollLeft -= metrics.setWidth;
    } else if (scroller.scrollLeft <= metrics.min) {
      scroller.scrollLeft += metrics.setWidth;
    }
  };

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (scroller == null) return;

    const centerScroller = () => {
      const metrics = getLoopMetrics();
      if (scrollerRef.current == null || metrics == null || metrics.setWidth <= 0) return;
      scrollerRef.current.scrollLeft = metrics.center;
    };

    window.requestAnimationFrame(centerScroller);

    const tick = () => {
      if (!draggingRef.current && scrollerRef.current != null) {
        scrollerRef.current.scrollLeft += 0.42;
        normalizeScroll();
      }
      frameRef.current = window.requestAnimationFrame(tick);
    };

    frameRef.current = window.requestAnimationFrame(tick);
    window.addEventListener(`resize`, centerScroller);

    return () => {
      window.removeEventListener(`resize`, centerScroller);
      if (frameRef.current != null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    if (scroller == null) return;
    draggingRef.current = true;
    setDragging(true);
    dragStartXRef.current = event.clientX;
    dragScrollLeftRef.current = scroller.scrollLeft;
    scroller.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    if (!dragging || scroller == null) return;
    const deltaX = event.clientX - dragStartXRef.current;
    scroller.scrollLeft = dragScrollLeftRef.current - deltaX;
    normalizeScroll();
  };

  const onPointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    const scroller = scrollerRef.current;
    draggingRef.current = false;
    setDragging(false);
    normalizeScroll();
    if (scroller?.hasPointerCapture(event.pointerId)) {
      scroller.releasePointerCapture(event.pointerId);
    }
  };

  const onPointerLeave = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    setDragging(false);
    normalizeScroll();
  };

  return (
    <div className={`topBar`} aria-label={`Piratechs highlights`}>
      <div
        ref={scrollerRef}
        role={`list`}
        tabIndex={0}
        className={`topBarScroller ${dragging ? `isDragging` : ``}`}
        onPointerUp={onPointerUp}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerLeave}
      >
        {marqueeItems.map((item, index) => (
          <span role={`listitem`} className={`topBarItem`} key={`${item.text}-${index}`}>
            <i className={item.icon} />
            {item.label ? <strong>{item.label}</strong> : null}
            <span>{item.text}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
