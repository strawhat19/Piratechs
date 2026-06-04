import { NextResponse } from 'next/server';
import { siteConfig } from '@/shared/config/site';

export function GET() {
  return NextResponse.json({
    app: siteConfig.title,
    status: `API Ready`,
    routes: [`/api/health`],
  });
}
