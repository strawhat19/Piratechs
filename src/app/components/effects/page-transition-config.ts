import type { ReactNode } from 'react';

export enum PageLoaders {
  Shutter = `Shutter`,
  Split = `Split`,
}

export const pageLoaderToShow: PageLoaders = PageLoaders.Split;

export type PageTransitionProps = {
  duration?: number;
  slanted?: boolean;
  children: ReactNode;
  showSpinner?: boolean;
  /** Seconds to hold the loader at 100% before its leave animation starts. */
  doneDelayBeforeLeave?: number;
};
