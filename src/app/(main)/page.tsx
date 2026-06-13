import type { Metadata } from 'next';
import { config } from '@/shared/config/config';
import HomeLanding from '@/app/components/sections/home-landing';

export const metadata: Metadata = {
  title: `${config.title} // Official Website`,
};

export default function HomePage() {
  return <HomeLanding />;
}
