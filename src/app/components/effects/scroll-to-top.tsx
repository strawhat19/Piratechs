'use client';

import { useEffect, useState } from 'react';

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY > 520);
    };

    updateVisibility();
    window.addEventListener(`scroll`, updateVisibility, { passive: true });
    return () => window.removeEventListener(`scroll`, updateVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: `smooth` });
  };

  return (
    <button
      type={`button`}
      aria-label={`Scroll to top`}
      onClick={scrollToTop}
      className={`scrollToTop ${isVisible ? `visible` : ``}`}
    >
      <i className={`fa-solid fa-arrow-up`} />
    </button>
  );
}
