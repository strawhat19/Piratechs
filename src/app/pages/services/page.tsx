import { Metadata } from 'next';
import { config } from '@/shared/config/config';
import RoutePage from '@/app/components/page-shell/route-page';

export const metadata: Metadata = {
  title: `Services // ${config.title}`,
};

export default function ServicesPage() {
  return <RoutePage pageID={`services`} />;
}
