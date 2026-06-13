import Link from 'next/link';
import ProjectDetailContent from '@/app/components/projects/project-detail-content';

type CaseStudyPageProps = {
  params: Promise<{
    projectName: string;
  }>;
};

export async function generateMetadata({ params }: CaseStudyPageProps) {
  const { projectName } = await params;
  const title = decodeURIComponent(projectName).replaceAll(/[-_]/g, ` `);
  return {
    title: `${title} // Case Study // Piratechs`,
  };
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps) {
  const { projectName } = await params;
  return (
    <section className={`pageSection projectCaseStudyPage`}>
      <div className={`sectionInner projectCaseStudyShell`}>
        <Link href={`/case-studies`} className={`buttonLink ghost projectCaseStudyBack`}>
          <i className={`fa-solid fa-arrow-left`} />
          <span>Case Studies</span>
        </Link>
        <ProjectDetailContent projectID={projectName} />
      </div>
    </section>
  );
}
