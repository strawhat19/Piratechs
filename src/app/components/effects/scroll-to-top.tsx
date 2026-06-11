'use client';

import { useEffect, useState } from 'react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY > 170);
    };
    updateVisibility();
    window.addEventListener(`scroll`, updateVisibility, { passive: true });
    return () => window.removeEventListener(`scroll`, updateVisibility);
  }, []);

  const scrollToTop = () => {
    const behavior = document.documentElement.classList.contains(`smoothScrollEnabled`) ? `auto` : `smooth`;
    window.scrollTo({ top: 0, behavior });
  };

  return (
    <button
      type={`button`}
      aria-label={`Scroll to top`}
      onClick={scrollToTop}
      className={`scrollToTop ${isVisible ? `visible` : ``}`}
    >
      <i className={`fa-solid fa-chevron-up logoLetter`} />
    </button>
  );
}
