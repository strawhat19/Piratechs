import { Metadata } from 'next';
import { config } from '@/shared/config/config';
import RoutePage from '@/app/components/page-shell/route-page';

export const metadata: Metadata = {
  title: `Gallery // ${config.title}`,
};

export default function GalleryPage() {
  return <RoutePage pageID={`gallery`} />;
}
