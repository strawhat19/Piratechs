import { NextResponse } from 'next/server';

export function GET() {
  return NextResponse.json({
    ok: true,
    app: `Piratechs`,
    status: `Next App Ready`,
  });
}
