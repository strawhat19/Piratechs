import { Metadata } from 'next';
import { siteConfig } from '@/shared/config/site';
import RoutePage from '@/app/components/page-shell/route-page';

export const metadata: Metadata = {
  title: `Projects // ${siteConfig.title}`,
};

export default function ProjectsPage() {
  return <RoutePage pageID={`projects`} />;
}
