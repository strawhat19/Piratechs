import { Project } from '../Project';
import { DataSources, Types } from '../../types/types';
import { customDate, genID } from '../../common/database/constants';
import { countPropertiesInObject, isValid } from '../../common/scripts/globals';

export class GitUser {
  [key: string]: any;

  id!: string;
  url: string = ``;
  bio: string = ``;
  name: string = ``;
  uuid!: string;
  login: string = ``;
  avatar: string = ``;
  website: string = ``;
  repoLink: string = ``;
  repoNum: number = 0;
  starred: string = ``;
  number: number = 1;
  followers: number = 0;
  following: number = 0;
  properties?: number;
  projects: Project[] = [];
  githubID?: number | string;
  source?: string = DataSources.Github;
  lastSignin: Date | string | any = customDate()?.datetime;
  updated: Date | string | any = customDate()?.datetime;
  created: Date | string | any = customDate()?.datetime;

  constructor(data: Partial<GitUser> = {}) {
    const userData = data as Partial<GitUser> & Record<string, any>;
    const github = userData.github || userData;
    const repos = userData.repos || userData.repositories || userData.projects || [];
    const externalID = typeof github.id == `number` ? github.id : userData.githubID;
    const safeData = { ...userData };
    delete safeData.github;
    delete safeData.repos;
    delete safeData.repositories;

    Object.assign(this, safeData);

    if (isValid(externalID) && !isValid(this.githubID)) this.githubID = externalID;
    if (!isValid(this.login) && isValid(github.login)) this.login = String(github.login);
    if (!isValid(this.name) && isValid(github.name)) this.name = String(github.name);
    if (!isValid(this.name) && isValid(this.login)) this.name = this.login;
    if (!isValid(this.url) && isValid(github.html_url)) this.url = String(github.html_url);
    if (!isValid(this.bio) && isValid(github.bio)) this.bio = String(github.bio);
    if (!isValid(this.website) && isValid(github.blog)) this.website = String(github.blog);
    if (!isValid(this.avatar) && isValid(github.avatar_url)) this.avatar = String(github.avatar_url);
    if (!isValid(this.repoLink) && isValid(github.repos_url)) this.repoLink = String(github.repos_url);
    if (!isValid(userData.repoNum) && isValid(github.public_repos)) this.repoNum = Number(github.public_repos);
    if (!isValid(this.starred) && isValid(github.starred_url)) this.starred = String(github.starred_url);
    if (!isValid(userData.followers) && isValid(github.followers)) this.followers = Number(github.followers);
    if (!isValid(userData.following) && isValid(github.following)) this.following = Number(github.following);

    const repoProjects = Array.isArray(repos) ? repos : [];
    this.projects = repoProjects
      .sort((a: any, b: any) => new Date(b?.created_at || b?.date || 0).getTime() - new Date(a?.created_at || a?.date || 0).getTime())
      .map((repo: any, index: number) => repo instanceof Project ? repo : new Project({ ...repo, number: index + 1, source: DataSources.Github }));

    const ID = genID(Types.User, this.number, this.name || this.login || `Github User`);
    const { id, uuid } = ID;
    if (!isValid(this.id)) this.id = id;
    if (!isValid(this.uuid)) this.uuid = uuid;
    if (!isValid(this.properties)) this.properties = countPropertiesInObject(this) + 1;
  }
}
