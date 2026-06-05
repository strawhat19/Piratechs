import { urlHostMatches } from '../scripts/globals';

export const development = process?.env?.NODE_ENV == `development`;
export const devEnv = urlHostMatches([`local`, `:3000`]) || development;