'use client';

import { useMemo, useState } from 'react';
import ProjectCard from '@/app/components/projects/project-card';
import { siteConfig } from '@/shared/config/site';

export default function ProjectGrid({ featuredOnly = false }: { featuredOnly?: boolean }) {
  const initialFilter = featuredOnly ? `Featured` : `All`;
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  const projects = useMemo(() => {
    const sortedProjects = [...siteConfig.projects].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
    return sortedProjects.filter(project => {
      if (activeFilter == `All`) return true;
      if (activeFilter == `Featured`) return project.featured;
      return project.type == activeFilter;
    });
  }, [activeFilter]);

  return (
    <>
      <div className={`filterBar reveal`} aria-label={`Project filters`}>
        {siteConfig.filters.map(filter => (
          <button
            key={filter}
            type={`button`}
            data-filter={filter}
            onClick={() => setActiveFilter(filter)}
            className={`filterButton ${filter == activeFilter ? `activeFilter` : ``}`}
            aria-pressed={filter == activeFilter}
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
