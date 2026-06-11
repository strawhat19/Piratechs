'use client';

import Slider from '../slider/slider';
import { useMemo, useState } from 'react';
import { config } from '@/shared/config/config';
import ProjectCard from '@/app/components/projects/project-card';
import { getProjects } from '@/app/components/projects/project-data';

export default function ProjectGrid({
  showImages = true,
  showFilters = false,
  featuredOnly = false,
}: any) {
  const initialFilter = featuredOnly ? `Featured` : `All`;
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  const projects = useMemo(() => {
    const projectsToShow = getProjects().filter(project => {
      if (activeFilter == `All`) return true;
      if (activeFilter == `Featured`) return project.featured;
      return project.type == activeFilter;
    });
    return projectsToShow;
  }, [activeFilter]);

  return (
    <>
      {showFilters && (
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
      )}
      <div className={`projectGrid fullBleed`} aria-live={`polite`}>
        <Slider 
          speed={35}
          direction={`ltr`}
          pauseonhover={false}
          id={`projectsSliderTop`}
          className={`projectsSlider`}
        >
          {projects?.slice(0, Math.ceil(projects.length / 2)).map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              showImages={showImages}
            />
          ))}
        </Slider>
        <Slider 
          speed={35}
          pauseonhover={false}
          id={`projectsSliderBottom`}
          className={`projectsSlider`}
        >
          {projects?.slice(Math.ceil(projects.length / 2)).map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              showImages={showImages}
            />
          ))}
        </Slider>
      </div>
    </>
  );
}
