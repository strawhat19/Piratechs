import { Types } from '@/shared/types/types';
import { colors } from '@/shared/theme/theme';
import { stringNoSpaces, urlHostMatches } from '../scripts/globals';

export const advancedDeviceThreshold = 4;
export const cores = navigator.hardwareConcurrency ?? advancedDeviceThreshold;
export const memory = (navigator as any).deviceMemory ?? advancedDeviceThreshold;
export const advancedDevice = memory > advancedDeviceThreshold && cores > advancedDeviceThreshold;

export const development = process?.env?.NODE_ENV == `development`;
export const devEnv = urlHostMatches([`local`, `:3000`]) || development;

export const defaultTimeZoneName = `America/New_York`;
export const isOdd = (number: number) => number % 2 != 0;
export const isEven = (number: number) => number % 2 == 0;
export const randomNumber = (max: number): number => Math.floor(Math.random() * max);
export const getRandomArrayIndex = (array: any[]) => Math.floor(Math.random() * array.length);
export const getRandomArrayValue = (array: any[]) => array[getRandomArrayIndex(array)];
export const arraySum = (arr: number[]): number => arr.reduce((total, val) => total + Number(val), 0);
export const getRandomColor = (array: any[] = Object.values(colors)) => array[getRandomArrayIndex(array)];

export const generateID = () => {
  let id = Math.random().toString(36).substr(2, 9);
  return Array.from(id).map(char => {
    return Math.random() > 0.5 ? char.toUpperCase() : char;
  }).join(``);
}

export const getIDParts = () => {
  let uuid = generateID();
  let date = customDate()?.datetime;
  return { uuid, date };
}

export const genID = (type: Types | string = Types.Data, number = 1, name: string) => {
  let { uuid, date } = getIDParts();
  let generatedUUID = uuid;
  let title = `${type} ${number} ${name}`;
  let idTitle = `${title} ${uuid}`;
  let id_Title = stringNoSpaces(idTitle);
  let idString = `${title} ${stringNoSpaces(date)} ${uuid}`;
  let id = stringNoSpaces(idString);
  return { id, date, uuid, title, id_Title, generatedUUID };
}

export const customDate = (date: Date = new Date()) => {
  let hours = date.getHours();
  let ampm = hours >= 12 ? `PM` : `AM`;
  let minutes: string | number = date.getMinutes();
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? `0` + minutes : minutes;
  let time = hours + `:` + minutes + ` ` + ampm;
  let dateSlashes = (slice: number = 0) => (date.getMonth() + 1) + `/` + date.getDate() + `/` + String(date.getFullYear()).slice(slice);
  let milliseconds = date.getMilliseconds();
  let seconds = String(milliseconds * 1000)?.slice(0, 2);
  let ms = Math.round(milliseconds / 10).toString().padStart(2, `0`);
  let secondsTime = `${hours}:${minutes}:${seconds} ${ampm}`;
  let update = `${secondsTime} ${dateSlashes(2)}`;
  let datesObject = {
    ms, // 54
    hours, // 3
    minutes, // 48
    seconds, // 54
    ampm, // AM / PM
    time, // 3:48 PM
    milliseconds, // 543
    secondsTime, // 3:48:54 PM
    update, // 3:48:54 PM 5/17/26
    date: dateSlashes(), // 5/17/2026
    datetime: time + ` ` + dateSlashes(2), // 3:48 PM 5/17/26
  }
  return datesObject;
}