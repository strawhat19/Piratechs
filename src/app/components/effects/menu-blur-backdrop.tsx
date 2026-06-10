'use client';

import { useEffect, useState } from 'react';
import { useGlobalContext } from '@/shared/global-context';

export const closeMenuOverlaysEvent = `piratechs:close-menu-overlays`;

const hasOpenMenuOverlay = () => (
  document.body.classList.contains(`menuOpen`)
  || document.body.classList.contains(`notificationPanelOpen`)
  || Boolean(document.querySelector(`.navActionReveal .authWidget.authOpen`))
);

export default function MenuBlurBackdrop() {
  const [open, setOpen] = useState(false);
  const { setMenuExpanded } = useGlobalContext();

  useEffect(() => {
    const syncOpen = () => setOpen(hasOpenMenuOverlay());
    syncOpen();
    const observer = new MutationObserver(syncOpen);
    observer.observe(document.body, { attributes: true, attributeFilter: [`class`], childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  const closeOverlays = () => {
    setMenuExpanded(false);
    window.dispatchEvent(new CustomEvent(closeMenuOverlaysEvent));
    setOpen(false);
  };

  return (
    <button
      type={`button`}
      tabIndex={-1}
      aria-hidden={`true`}
      onClick={closeOverlays}
      className={`menuBlurBackdrop ${open ? `menuBlurBackdropOpen` : ``}`}
    />
  );
}
