'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import BottomSheet from '@/app/components/sheet/bottom-sheet';
import { findProjectByID } from '@/app/components/projects/project-data';
import ProjectDetailContent from '@/app/components/projects/project-detail-content';

type ProjectDetailSheetProps = {
  open?: boolean;
  onClose?: () => void;
  projectID?: string | null;
};

export default function ProjectDetailSheet({
  onClose,
  projectID,
  open = true,
}: ProjectDetailSheetProps) {
  const router = useRouter();
  const isOpen = Boolean(open && projectID);
  const project = projectID ? findProjectByID(projectID) : null;
  const navigateToProjects = useCallback(() => router.push(`/projects`), [router]);
  const closeSheet = onClose ?? navigateToProjects;

  return (
    <BottomSheet open={isOpen} label={`${project?.title ?? `Project`} Details`} className={`projectDetailSheet`} onClose={closeSheet}>
      {projectID ? <ProjectDetailContent projectID={projectID} /> : null}
    </BottomSheet>
  );
}
