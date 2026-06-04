import { Metadata } from 'next';
import { siteConfig } from '@/shared/config/site';
import RoutePage from '@/app/components/page-shell/route-page';

export const metadata: Metadata = {
  title: `Gallery // ${siteConfig.title}`,
};

export default function GalleryPage() {
  return <RoutePage pageID={`gallery`} />;
}
