import { Metadata } from 'next';
import { siteConfig } from '@/shared/config/site';
import RoutePage from '@/app/components/page-shell/route-page';

export const metadata: Metadata = {
  title: `Contact // ${siteConfig.title}`,
};

export default function ContactPage() {
  return <RoutePage pageID={`contact`} />;
}
