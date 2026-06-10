'use client';

import { useMemo, useState } from 'react';
import { config } from '@/shared/config/config';
import { Project } from '@/shared/models/Project';
import ProjectCard from '@/app/components/projects/project-card';
import { devEnv, publicImageURLs } from '@/shared/common/database/constants';
import { gitUser } from '@/shared/common/database/github/users/strawhat19/user';

export const featuredProjects = {
  [`MyDex-Pokedex-Clone`]: { name: `MyDex-Pokedex-Clone`, },
  [`Piratechs` ]: { name: `Piratechs`, urlImage: `/icon-192x192_Circle.png` }, 
  [`Smart-Garden` ]: { name: `Smart-Garden`, urlImage: `https://smart-garden-zeta.vercel.app/assets/SmartGardenIcon.svg` }, 
  [`React-Netflix-Clone`]: { name: `React-Netflix-Clone`, urlImage: `https://react-netflix-clone-piratechs.vercel.app/favicon.ico` },
  [`CreativeWorkshop`]: { name: `CreativeWorkshop`, title: `Creative Workshop`, urlImage: `https://creative-workshop.vercel.app/assets/images/CatIcon.png` },
  [`Dyer-Posta` ]: { name: `Dyer-Posta`, title: `Dyer & Posta`, urlImage: `https://dyerposta.com/wp-content/uploads/2021/03/cropped-Official-Logo-Icon-GreenCircle.png` }, 
} satisfies { [key: string]: Partial<Project> };

export const featuredProjectNames = Object.keys(featuredProjects);

const fallbackProjectImages = Object.values(publicImageURLs?.horizontal ?? {}) as string[];

const getProjectImage = (project: Project | any, index: number) => {
  if (!fallbackProjectImages?.length) return publicImageURLs?.horizontal?.night;
  const imageKey = String(project?.id ?? project?.name ?? index);
  const imageIndex = Array.from(imageKey).reduce((total, char) => total + char.charCodeAt(0), 0) % fallbackProjectImages.length;
  return fallbackProjectImages?.[imageIndex] ?? publicImageURLs?.horizontal?.night;
};

export default function ProjectGrid({ 
  showImages = true, 
  featuredOnly = false, 
}: any) {
  const initialFilter = featuredOnly ? `Featured` : `All`;
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  const projects = useMemo(() => {
    const gitProjects = gitUser?.projects;
    const gitProjectsWFeatured = gitProjects?.map((gp, index) => {
      let featuredProjectOverrides = (featuredProjects as any)?.[gp?.name as any] ?? {};
      let modifiedProject = { 
        ...gp, 
        featured: gp?.featured || featuredProjectNames?.includes(gp?.name), 
        ...featuredProjectOverrides,
        ...(featuredProjectOverrides?.mediaURL ? {} : { mediaURL: getProjectImage(gp, index) }),
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
          <ProjectCard key={project.id} project={project} showImages={showImages} />
        ))}
      </div>
    </>
  );
}
