import { Metadata } from 'next';
import { siteConfig } from '@/shared/config/site';
import RoutePage from '@/app/components/page-shell/route-page';

export const metadata: Metadata = {
  title: `Features // ${siteConfig.title}`,
};

export default function FeaturesPage() {
  return <RoutePage pageID={`features`} />;
}
