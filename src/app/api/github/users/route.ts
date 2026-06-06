import { NextResponse } from 'next/server';

const defaultGithubUsername = `strawhat19`;

export function GET(request: Request) {
  return NextResponse.redirect(new URL(`/api/github/users/${defaultGithubUsername}`, request.url));
}
