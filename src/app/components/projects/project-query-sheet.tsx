'use client';

import { useEffect, useState } from 'react';
import ProjectDetailSheet from '@/app/components/projects/project-detail-sheet';
import {
  projectQueryEvent,
  projectSheetOpenEvent,
  projectSheetRouteSync,
} from '@/app/components/projects/project-data';

const getProjectFromURL = () => {
  if (typeof window == `undefined`) return null;
  const url = new URL(window.location.href);
  return url.searchParams.get(`project`);
};

export default function ProjectQuerySheet() {
  const [activeProject, setActiveProject] = useState<string | null>(null);

  useEffect(() => {
    const openProjectSheet = (event: Event) => {
      const projectID = (event as CustomEvent<{ projectID?: string }>).detail?.projectID ?? null;
      setActiveProject(projectID);
    };
    const syncProjectFromURL = () => setActiveProject(getProjectFromURL());
    window.addEventListener(projectSheetOpenEvent, openProjectSheet);
    if (projectSheetRouteSync) {
      syncProjectFromURL();
      window.addEventListener(`popstate`, syncProjectFromURL);
      window.addEventListener(projectQueryEvent, syncProjectFromURL);
    }
    return () => {
      window.removeEventListener(projectSheetOpenEvent, openProjectSheet);
      if (projectSheetRouteSync) {
        window.removeEventListener(`popstate`, syncProjectFromURL);
        window.removeEventListener(projectQueryEvent, syncProjectFromURL);
      }
    };
  }, []);

  const closeProjectSheet = () => {
    if (projectSheetRouteSync) {
      const url = new URL(window.location.href);
      url.searchParams.delete(`project`);
      window.history.replaceState(null, ``, `${url.pathname}${url.search}${url.hash}`);
    }
    setActiveProject(null);
  };

  return (
    <ProjectDetailSheet open={Boolean(activeProject)} projectID={activeProject} onClose={closeProjectSheet} />
  );
}
