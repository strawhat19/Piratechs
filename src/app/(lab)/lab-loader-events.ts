'use client';

// Tiny event bus so the (lab) page can defer its intro animations until the
// LabLoader has counted to 100% and slid away. Decoupled via a window event
// because the loader lives in the layout while the page is its child.

export const labLoaderDoneEvent = `lab:loader-done`;

let done = false;

export function isLabLoaderDone() {
  return done;
}

export function markLabLoaderDone() {
  if (done) return;
  done = true;
  window.dispatchEvent(new Event(labLoaderDoneEvent));
}
