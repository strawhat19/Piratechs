import { NextResponse } from 'next/server';
import { config } from '@/shared/config/config';

export function GET() {
  return NextResponse.json({
    app: config.title,
    status: `API Ready`,
    routes: [`/api/health`],
  });
}
