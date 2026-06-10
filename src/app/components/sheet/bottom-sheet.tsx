'use client';

import gsap from 'gsap';
import { useCallback, useEffect, useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react';

type BottomSheetProps = {
  children: ReactNode;
  label?: string;
  height?: string;
  className?: string;
  closeLabel?: string;
  showHandle?: boolean;
  onClose?: () => void;
};

export default function BottomSheet({
  children,
  onClose,
  className,
  label = `Sheet`,
  height = `85dvh`,
  showHandle = false,
  closeLabel = `Close`,
}: BottomSheetProps) {
  const closingRef = useRef(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLButtonElement>(null);

  const closeSheet = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    const sheet = sheetRef.current;
    const backdrop = backdropRef.current;
    const timeline = gsap.timeline({ onComplete: onClose });
    if (sheet) {
      timeline.to(sheet, {
        opacity: 0,
        scale: 0.96,
        duration: 0.7,
        yPercent: 100,
        ease: `power3.inOut`,
      }, 0);
    }
    if (backdrop) {
      timeline.to(backdrop, {
        autoAlpha: 0,
        duration: 0.69,
        ease: `power2.inOut`,
        backdropFilter: `blur(0px) saturate(100%)`,
        webkitBackdropFilter: `blur(0px) saturate(100%)`,
      }, 0);
    }
  }, [onClose]);

  useEffect(() => {
    document.body.classList.add(`bottomSheetOpen`);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key == `Escape`) closeSheet();
    };
    document.addEventListener(`keydown`, onKeyDown);
    return () => {
      document.body.classList.remove(`bottomSheetOpen`);
      document.removeEventListener(`keydown`, onKeyDown);
    };
  }, [closeSheet]);

  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    const backdrop = backdropRef.current;
    const timeline = gsap.timeline({ defaults: { ease: `power3.inOut` } });
    if (backdrop) {
      gsap.set(backdrop, {
        autoAlpha: 1,
        backdropFilter: `blur(0px) saturate(100%)`,
        webkitBackdropFilter: `blur(0px) saturate(100%)`,
      });
      timeline.to(backdrop, {
        duration: 0.69,
        backdropFilter: `blur(18px) saturate(145%)`,
        webkitBackdropFilter: `blur(18px) saturate(145%)`,
      }, 0);
    }
    if (sheet) {
      gsap.set(sheet, { autoAlpha: 1, xPercent: -50, yPercent: 104, scale: 0.97, transformOrigin: `bottom center`, width: `85%`, });
      timeline.to(sheet, {
        scale: 1,
        yPercent: 0,
        width: `95%`,
        duration: 0.7,
        ease: `power3.inOut`,
      }, 0);
    }
    return () => {
      timeline.kill();
    };
  }, []);

  return (
    <div className={`bottomSheetLayer`} aria-label={label} role={`dialog`} aria-modal={`true`}>
      <button
        type={`button`}
        ref={backdropRef}
        onClick={closeSheet}
        aria-label={closeLabel}
        className={`bottomSheetBackdrop`}
      />
      <div ref={sheetRef} className={[`bottomSheet`, className].filter(Boolean).join(` `)} style={{ '--bottom-sheet-height': height } as CSSProperties}>
        <button type={`button`} className={`bottomSheetClose iconButton`} aria-label={closeLabel} onClick={closeSheet}>
          <i className={`fa-solid fa-xmark`} />
        </button>
        {showHandle && <span className={`bottomSheetHandle`} aria-hidden={`true`} />}
        {children}
      </div>
    </div>
  );
}
