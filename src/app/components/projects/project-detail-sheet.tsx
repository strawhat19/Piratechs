'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import BottomSheet from '@/app/components/sheet/bottom-sheet';
import ProjectDetailContent from '@/app/components/projects/project-detail-content';
import { findProjectByID } from '@/app/components/projects/project-data';

type ProjectDetailSheetProps = {
  projectID: string;
  onClose?: () => void;
};

export default function ProjectDetailSheet({
  projectID,
  onClose,
}: ProjectDetailSheetProps) {
  const router = useRouter();
  const project = findProjectByID(projectID);
  const navigateToProjects = useCallback(() => router.push(`/projects`), [router]);
  const closeSheet = onClose ?? navigateToProjects;

  return (
    <BottomSheet label={`${project?.title ?? `Project`} Details`} className={`projectDetailSheet`} onClose={closeSheet}>
      <ProjectDetailContent projectID={projectID} showCaseStudyLink />
    </BottomSheet>
  );
}
