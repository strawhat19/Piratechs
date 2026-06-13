import { Metadata } from 'next';
import { config } from '@/shared/config/config';
import RoutePage from '@/app/components/page-shell/route-page';

export const metadata: Metadata = {
  title: `Features // ${config.title}`,
};

export default function FeaturesPage() {
  return <RoutePage pageID={`features`} />;
}
