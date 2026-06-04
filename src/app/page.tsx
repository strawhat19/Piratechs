import type { Metadata } from 'next';
import HomeLanding from '@/app/components/sections/home-landing';
import { siteConfig } from '@/shared/config/site';

export const metadata: Metadata = {
  title: `${siteConfig.title} | Full-Stack Portfolio`,
};

export default function HomePage() {
  return <HomeLanding />;
}
