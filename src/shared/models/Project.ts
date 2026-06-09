import { DataSources, Types } from '../types/types';
import { customDate, genID } from '../common/database/constants';
import { capWords, countPropertiesInObject, isValid } from '../common/scripts/globals';

export const defaultType: Types = Types.Project;

export class Project {
  [key: string]: any;

  id!: string;
  uuid!: string;
  name: string = ``;
  number: number = 1;
  properties?: number;
  summary: string = ``;
  topics: string[] = [];
  status: string = `Code`;
  featured?: boolean = false;
  title: string = defaultType;
  type: Types | string = defaultType;
  source?: string = DataSources.Database;
  created: Date | string | any = customDate()?.datetime;
  updated: Date | string | any = customDate()?.datetime;

  owner?: any;
  license?: any;
  githubID?: number;
  url?: string | any;
  date?: string | any;
  image?: string | any;
  codeUrl?: string | any;
  liveUrl?: string | any;
  urlImage?: string | any;
  language?: string | any;
  mediaURL?: string | any;
  homepage?: string | any;
  deployment?: string | any;
  description?: string | any;

  constructor(data: Partial<Project> = {}) {
    const projectData = data as Partial<Project> & Record<string, any>;
    const externalID = typeof projectData.id == `number` ? projectData.id : projectData.githubID;
    if (typeof projectData.id == `number`) delete projectData.id;

    Object.assign(this, projectData);

    if (isValid(externalID) && !isValid(this.githubID)) this.githubID = Number(externalID);
    if (!isValid(this.name) && isValid(projectData.name)) this.name = String(projectData.name);
    if (!isValid(this.name) && isValid(projectData.title)) this.name = String(projectData.title);
    if (!isValid(projectData.title) && isValid(this.name)) this.title = capWords(this.name.replaceAll(/[-_]/g, ` `));
    if (!isValid(this.name) && isValid(this.title)) this.name = this.title;
    if (!isValid(this.summary) && isValid(projectData.description)) this.summary = String(projectData.description);
    if (!isValid(this.description) && isValid(this.summary)) this.description = this.summary;
    if (!isValid(this.homepage) && isValid(projectData.homepage)) this.homepage = String(projectData.homepage);
    if (!isValid(this.liveUrl) && isValid(this.homepage)) this.liveUrl = this.homepage;
    if (!isValid(this.codeUrl) && isValid(projectData.html_url)) this.codeUrl = String(projectData.html_url);
    if (!isValid(this.codeUrl) && isValid(projectData.url)) this.codeUrl = String(projectData.url);
    if (!isValid(this.url) && isValid(this.codeUrl)) this.url = this.codeUrl;
    if (!isValid(this.urlImage) && isValid(projectData.image)) this.urlImage = String(projectData.image);
    if (!isValid(this.mediaURL) && isValid(this.urlImage)) this.mediaURL = this.urlImage;
    if (!isValid(this.date) && isValid(projectData.created_at)) this.date = String(projectData.created_at);
    if (isValid(projectData.created_at) && !isValid(projectData.created)) this.created = String(projectData.created_at);
    if (isValid(projectData.updated_at) && !isValid(projectData.updated)) this.updated = String(projectData.updated_at);
    if (!isValid(this.language) && isValid(projectData.language)) this.language = String(projectData.language);
    if (!isValid(this.source) && isValid(projectData.source)) this.source = String(projectData.source);

    const topics = Array.isArray(projectData.topics) ? projectData.topics.map(String) : [];
    this.topics = Array.from(new Set([...(this.topics || []), ...topics].filter(Boolean).map(String)));
    if (this.topics.length == 0) this.topics = [`Code`];
    if (!isValid(projectData.type)) this.type = this.language || this.topics?.[0] || `Project`;
    if (!isValid(projectData.status)) this.status = this.liveUrl ? `Live` : this.status;
    if (!isValid(this.summary)) this.summary = `${this.title} project`;

    const ID = genID(Types.Project, this.number, this.title);
    const { id, title, uuid } = ID;
    if (!isValid(this.id)) this.id = id;
    if (!isValid(this.uuid)) this.uuid = uuid;
    if (!isValid(this.title)) this.title = title;
    if (!isValid(this.properties)) this.properties = countPropertiesInObject(this) + 1;
  }
}
