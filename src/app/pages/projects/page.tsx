import { Metadata } from 'next';
import { config } from '@/shared/config/config';
import RoutePage from '@/app/components/page-shell/route-page';

export const metadata: Metadata = {
  title: `Projects // ${config.title}`,
};

export default function ProjectsPage() {
  return <RoutePage pageID={`projects`} />;
}
