'use client';

import { useMemo, useState } from 'react';
import { config } from '@/shared/config/config';
import { Project } from '@/shared/models/Project';
import { devEnv } from '@/shared/common/database/constants';
import ProjectCard from '@/app/components/projects/project-card';
import { gitUser } from '@/shared/common/database/github/users/strawhat19/user';

export const featuredProjects = [
  // new Project({ name: `Lister` }),
  new Project({ name: `Piratechs`, }), 
  // new Project({ name: `Traveler` }),
  // new Project({ name: `Sanctuary` }),
  new Project({ name: `Dyer-Posta`, }), 
  new Project({ name: `Smart-Garden`, }), 
  // new Project({ name: `Discord-Bots` }),
  // new Project({ name: `Tower-Defense` }),
  new Project({ name: `React-Netflix-Clone` }),
  new Project({ name: `MyDex-Pokedex-Clone` }),
  // new Project({ name: `Sumit-Transcription-Form` }),
  // new Project({ name: `Piratechs-Next-PWA-Template-2025` }),
];

export const featuredProjectNames = featuredProjects?.map(fp => fp?.name);

export default function ProjectGrid({ featuredOnly = false }: { featuredOnly?: boolean }) {
  const initialFilter = featuredOnly ? `Featured` : `All`;
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  const projects = useMemo(() => {
    const gitProjects = gitUser?.projects;
    const gitProjectsWFeatured = gitProjects?.map(gp => ({ ...gp, featured: gp?.featured || featuredProjectNames?.includes(gp?.name) }));
    const configProjects = gitProjectsWFeatured;
    const sortedProjects = configProjects.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    const projectsToShow = sortedProjects.filter(project => {
      if (activeFilter == `All`) return true;
      if (activeFilter == `Featured`) return project.featured;
      return project.type == activeFilter;
    });
    devEnv && console.log(`Project(s)`, { allProjects: configProjects, projects: projectsToShow, user: gitUser });
    return projectsToShow;
  }, [activeFilter]);

  return (
    <>
      <div className={`filterBar reveal`} aria-label={`Project filters`}>
        {config.filters.map(filter => (
          <button
            key={filter}
            type={`button`}
            data-filter={filter}
            aria-pressed={filter == activeFilter}
            onClick={() => setActiveFilter(filter)}
            className={`filterButton logoLetter ${filter == activeFilter ? `activeFilter` : ``}`}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className={`projectGrid`} aria-live={`polite`}>
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </>
  );
}
