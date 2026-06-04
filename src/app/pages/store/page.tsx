import { Metadata } from 'next';
import { siteConfig } from '@/shared/config/site';
import RoutePage from '@/app/components/page-shell/route-page';

export const metadata: Metadata = {
  title: `Store // ${siteConfig.title}`,
};

export default function StorePage() {
  return <RoutePage pageID={`store`} />;
}
