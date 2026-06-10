'use client';

import { useEffect, useState } from 'react';
import ProjectDetailSheet from '@/app/components/projects/project-detail-sheet';

const projectQueryEvent = `piratechs:project-query-change`;

const getProjectFromURL = () => {
  if (typeof window == `undefined`) return null;
  const url = new URL(window.location.href);
  return url.searchParams.get(`project`);
};

export default function ProjectQuerySheet() {
  const [activeProject, setActiveProject] = useState<string | null>(null);

  useEffect(() => {
    const syncProjectFromURL = () => setActiveProject(getProjectFromURL());
    syncProjectFromURL();
    window.addEventListener(`popstate`, syncProjectFromURL);
    window.addEventListener(projectQueryEvent, syncProjectFromURL);
    return () => {
      window.removeEventListener(`popstate`, syncProjectFromURL);
      window.removeEventListener(projectQueryEvent, syncProjectFromURL);
    };
  }, []);

  const closeProjectSheet = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete(`project`);
    window.history.replaceState(null, ``, `${url.pathname}${url.search}${url.hash}`);
    setActiveProject(null);
  };

  return activeProject ? (
    <ProjectDetailSheet key={activeProject} projectID={activeProject} onClose={closeProjectSheet} />
  ) : null;
}
