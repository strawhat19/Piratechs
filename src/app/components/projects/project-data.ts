import { Project } from '@/shared/models/Project';
import { devEnv, publicImageURLs } from '@/shared/common/database/constants';
import { gitUser } from '@/shared/common/database/github/users/strawhat19/user';

export const projectSheetRouteSync = false;
export const projectQueryEvent = `piratechs:project-query-change`;
export const projectSheetOpenEvent = `piratechs:project-sheet-open`;

export const featuredProjects = {
  [`MyDex-Pokedex-Clone`]: { name: `MyDex-Pokedex-Clone` },
  [`Piratechs`]: { name: `Piratechs`, urlImage: `/icon-192x192_Circle.png` },
  [`Smart-Garden`]: { name: `Smart-Garden`, urlImage: `https://smart-garden-zeta.vercel.app/assets/SmartGardenIcon.svg` },
  [`React-Netflix-Clone`]: { name: `React-Netflix-Clone`, urlImage: `https://react-netflix-clone-piratechs.vercel.app/favicon.ico` },
  [`CreativeWorkshop`]: { name: `CreativeWorkshop`, title: `Creative Workshop`, urlImage: `https://creative-workshop.vercel.app/assets/images/CatIcon.png` },
  [`Dyer-Posta`]: { name: `Dyer-Posta`, title: `Dyer & Posta`, urlImage: `https://dyerposta.com/wp-content/uploads/2021/03/cropped-Official-Logo-Icon-GreenCircle.png` },
} satisfies { [key: string]: Partial<Project> };

export const featuredProjectNames = Object.keys(featuredProjects);

const fallbackProjectImages = Object.values(publicImageURLs?.horizontal ?? {}) as string[];

export const getProjectImage = (project: Project | any, index: number) => {
  if (!fallbackProjectImages?.length) return publicImageURLs?.horizontal?.night;
  const imageKey = String(project?.id ?? project?.name ?? index);
  const imageIndex = Array.from(imageKey).reduce((total, char) => total + char.charCodeAt(0), 0) % fallbackProjectImages.length;
  return fallbackProjectImages?.[imageIndex] ?? publicImageURLs?.horizontal?.night;
};

export const getProjectNameParam = (project: Project | any) => String(project?.name ?? project?.title ?? project?.id ?? ``);

export const getProjectQueryHref = (project: Project | any) => (
  projectSheetRouteSync ? `?project=${encodeURIComponent(getProjectNameParam(project))}` : `#${encodeURIComponent(getProjectNameParam(project))}`
);

export const getCaseStudyHref = (project: Project | string | any) => {
  const projectName = typeof project == `string` ? project : getProjectNameParam(project);
  return `/case-studies/${encodeURIComponent(projectName)}`;
};

export const getProjects = () => {
  const gitProjects = gitUser?.projects ?? [];
  const projects = gitProjects.map((gp, index) => {
    const gitProject = gp as Project | any;
    const featuredProjectOverrides = (featuredProjects as any)?.[gitProject?.name as any] ?? {};
    return {
      ...gitProject,
      featured: gitProject?.featured || featuredProjectNames?.includes(gitProject?.name),
      ...featuredProjectOverrides,
      ...(featuredProjectOverrides?.mediaURL ? {} : { mediaURL: gitProject?.mediaURL || getProjectImage(gitProject, index) }),
    };
  });
  const sortedProjects = [...projects].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
  devEnv && console.log(`Project(s)`, { featuredProjects, allProjects: sortedProjects, user: gitUser });
  return sortedProjects;
};

export const findProjectByID = (projectID: string) => {
  const decodedProjectID = decodeURIComponent(String(projectID ?? ``));
  const normalizedProjectID = decodedProjectID.toLowerCase();
  return getProjects().find(project => (
    [project?.id, project?.name, project?.title].some(value => String(value ?? ``).toLowerCase() == normalizedProjectID)
  ));
};
