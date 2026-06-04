import type { Metadata } from 'next';
import { siteConfig } from '@/shared/config/site';
import HomeLanding from '@/app/components/sections/home-landing';

export const metadata: Metadata = {
  title: `${siteConfig.title} // Official Website`,
};

export default function HomePage() {
  return <HomeLanding />;
}
