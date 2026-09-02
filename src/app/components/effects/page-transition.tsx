'use client';

import SplitPageTransition from './split-page-transition';
import ShutterPageTransition from './shutter-page-transition';
import {
  PageLoaders,
  pageLoaderToShow,
  type PageTransitionProps,
} from './page-transition-config';

const PageTransition = (props: PageTransitionProps) => {
  switch (pageLoaderToShow) {
    case PageLoaders.Shutter:
      return <ShutterPageTransition {...props} />;
    case PageLoaders.Split:
    default:
      return <SplitPageTransition {...props} />;
  }
};

export default PageTransition;
