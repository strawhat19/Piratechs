import { NextResponse } from 'next/server';
import { GitUser } from '@/shared/models/github/GitUser';

type GithubUsersRouteContext = {
  params: Promise<{
    username: string;
  }>;
};

const getGithubHeaders = () => {
  const headers: HeadersInit = {
    Accept: `application/vnd.github+json`,
    'User-Agent': `Piratechs`,
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return headers;
};

export async function GET(_request: Request, context: GithubUsersRouteContext) {
  const { username } = await context.params;
  const cleanUsername = String(username || ``).trim();
  if (!cleanUsername) {
    return NextResponse.json({ error: `Github Username Required` }, { status: 400 });
  }

  const githubUsername = encodeURIComponent(cleanUsername);
  const headers = getGithubHeaders();
  const userURL = `https://api.github.com/users/${githubUsername}`;
  const reposURL = `https://api.github.com/users/${githubUsername}/repos?sort=created&direction=desc&per_page=100`;
  const [userResponse, reposResponse] = await Promise.all([
    fetch(userURL, { headers }),
    fetch(reposURL, { headers }),
  ]);

  if (!userResponse.ok) {
    return NextResponse.json({ error: `Github User Not Found` }, { status: userResponse.status });
  }
  if (!reposResponse.ok) {
    return NextResponse.json({ error: `Github Repos Not Found` }, { status: reposResponse.status });
  }

  const [github, repos] = await Promise.all([
    userResponse.json(),
    reposResponse.json(),
  ]);
  const gitUser = new GitUser({ github, repos });
  return NextResponse.json(gitUser);
}
