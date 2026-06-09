export const pageTransitionReadyEvent = `piratechs:page-transition-ready`;
export const pageTransitionPendingClass = `pageTransitionPending`;
export const pageTransitionCompleteClass = `pageTransitionComplete`;

export const isPageTransitionPending = () => (
  typeof document != `undefined` && document.body.classList.contains(pageTransitionPendingClass)
);
