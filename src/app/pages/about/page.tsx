import { Metadata } from 'next';
import { siteConfig } from '@/shared/config/site';
import RoutePage from '@/app/components/page-shell/route-page';

export const metadata: Metadata = {
  title: `About // ${siteConfig.title}`,
};

export default function AboutPage() {
  return <RoutePage pageID={`about`} />;
}
