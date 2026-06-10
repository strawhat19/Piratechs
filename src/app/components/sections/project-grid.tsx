'use client';

import { useMemo, useState } from 'react';
import { config } from '@/shared/config/config';
import { Project } from '@/shared/models/Project';
import ProjectCard from '@/app/components/projects/project-card';
import { devEnv, getRandomImage } from '@/shared/common/database/constants';
import { gitUser } from '@/shared/common/database/github/users/strawhat19/user';

export const featuredProjects = {
  [`Piratechs` ]: { name: `Piratechs`, urlImage: `/icon-192x192_Circle.png` }, 
  [`Smart-Garden` ]: { name: `Smart-Garden`, urlImage: `https://smart-garden-zeta.vercel.app/assets/SmartGardenIcon.svg` }, 
  [`React-Netflix-Clone`]: { name: `React-Netflix-Clone`, urlImage: `https://react-netflix-clone-piratechs.vercel.app/favicon.ico` },
  [`MyDex-Pokedex-Clone`]: { name: `MyDex-Pokedex-Clone`, },
  [`Dyer-Posta` ]: { name: `Dyer-Posta`, title: `Dyer & Posta`, urlImage: `https://dyerposta.com/wp-content/uploads/2021/03/cropped-Official-Logo-Icon-GreenCircle.png` }, 
} satisfies { [key: string]: Partial<Project> };

export const featuredProjectNames = Object.keys(featuredProjects);

export default function ProjectGrid({ featuredOnly = false }: { featuredOnly?: boolean }) {
  const initialFilter = featuredOnly ? `Featured` : `All`;
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  const projects = useMemo(() => {
    const gitProjects = gitUser?.projects;
    const gitProjectsWFeatured = gitProjects?.map(gp => {
      let featuredProjectOverrides = (featuredProjects as any)?.[gp?.name as any] ?? {};
      let modifiedProject = { 
        ...gp, 
        featured: gp?.featured || featuredProjectNames?.includes(gp?.name), 
        ...featuredProjectOverrides,
        ...(featuredProjectOverrides?.mediaURL ? {} : { mediaURL: getRandomImage() }),
      };
      return modifiedProject;
    });
    const configProjects = gitProjectsWFeatured;
    const sortedProjects = configProjects.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    const projectsToShow = sortedProjects.filter(project => {
      if (activeFilter == `All`) return true;
      if (activeFilter == `Featured`) return project.featured;
      return project.type == activeFilter;
    });
    devEnv && console.log(`Project(s)`, { featuredProjects, allProjects: configProjects, projects: projectsToShow, user: gitUser });
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
