import { Metadata } from 'next';
import { config } from '@/shared/config/config';
import RoutePage from '@/app/components/page-shell/route-page';

export const metadata: Metadata = {
  title: `About // ${config.title}`,
};

export default function AboutPage() {
  return <RoutePage pageID={`about`} />;
}
