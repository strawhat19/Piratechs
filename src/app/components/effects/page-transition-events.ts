export const pageTransitionReadyEvent = `piratechs:page-transition-ready`;
export const pageTransitionRevealEvent = `piratechs:page-transition-reveal`;
export const pageTransitionPendingClass = `pageTransitionPending`;
export const pageTransitionRevealingClass = `pageTransitionRevealing`;
export const pageTransitionCompleteClass = `pageTransitionComplete`;

export const isPageTransitionPending = () => (
  typeof document != `undefined` && document.body.classList.contains(pageTransitionPendingClass)
);

export const isPageTransitionRevealing = () => (
  typeof document != `undefined` && document.body.classList.contains(pageTransitionRevealingClass)
);
