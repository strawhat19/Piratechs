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

export const publicImageURLs: any = {
  vertical: {
    ocean: `https://images.pexels.com/photos/1802268/pexels-photo-1802268.jpeg?w=1280&h=1920`,
    sunset: `https://images.pexels.com/photos/561463/pexels-photo-561463.jpeg?w=1280&h=1883`,
    skyview: `https://images.pexels.com/photos/2860705/pexels-photo-2860705.jpeg?w=1280&h=1920`,
    diver: `https://images.pexels.com/photos/4666754/pexels-photo-4666754.jpeg?w=1280&h=1916`,
    hand: `https://images.pexels.com/photos/1072842/pexels-photo-1072842.jpeg?w=1280&h=1920`,
    night: `https://images.pexels.com/photos/2098427/pexels-photo-2098427.jpeg?w=1280&h=1920`,
    sky: `https://images.pexels.com/photos/1591252/pexels-photo-1591252.jpeg?w=1280&h=1920`,
    birds: `https://images.pexels.com/photos/207237/pexels-photo-207237.jpeg?w=1280&h=1920`,
    skymountain: `https://images.pexels.com/photos/1624504/pexels-photo-1624504.jpeg?w=1280&h=1920`,
    mountain: `https://images.pexels.com/photos/2387876/pexels-photo-2387876.jpeg?w=1280&h=1920`,
    darkjungle: `https://images.pexels.com/photos/2609106/pexels-photo-2609106.jpeg?w=1280&h=1920`,
    frostmountain: `https://images.pexels.com/photos/1366907/pexels-photo-1366907.jpeg?w=1280&h=1920`,
    bridge: `https://images.pexels.com/photos/358457/pexels-photo-358457.jpeg?w=1280&h=1920`,
    bridgewater: `https://images.pexels.com/photos/1398195/pexels-photo-1398195.jpeg?w=1280&h=1920`,
    trees: `https://images.pexels.com/photos/258123/pexels-photo-258123.jpeg?w=1280&h=1923`,
    mountainreflection: `https://images.pexels.com/photos/2444429/pexels-photo-2444429.jpeg?w=1280&h=1933`,
    nightbridge: `https://images.pexels.com/photos/1680247/pexels-photo-1680247.jpeg?w=1280&h=1917`,
    sunsetpeak: `https://images.pexels.com/photos/1459534/pexels-photo-1459534.jpeg?w=1280&h=1815`,
    nightvalley: `https://images.pexels.com/photos/2832039/pexels-photo-2832039.jpeg?w=1280&h=1759`,
    snowmountain: `https://images.pexels.com/photos/4215100/pexels-photo-4215100.jpeg?w=1280&h=1707`,
    darkleaf: `https://images.pexels.com/photos/1407305/pexels-photo-1407305.jpeg?w=1280&h=1707`,
    volcano: `https://images.pexels.com/photos/1743165/pexels-photo-1743165.jpeg?w=1280&h=1696`,
    girlmountain: `https://images.pexels.com/photos/4652275/pexels-photo-4652275.jpeg?w=1280&h=1600`,
    topbridge: `https://images.pexels.com/photos/1609440/pexels-photo-1609440.jpeg?w=1280&h=1600`,
    roadbridge: `https://images.pexels.com/photos/1590190/pexels-photo-1590190.jpeg?w=1280&h=1600`,
    jungle: `https://images.pexels.com/photos/788200/pexels-photo-788200.jpeg?w=1280&h=1600`,
    jelly: `https://images.pexels.com/photos/1076758/pexels-photo-1076758.jpeg?w=1280&h=1446`,
  },
  horizontal: {
    sky: `https://images.pexels.com/photos/55787/pexels-photo-55787.jpeg?w=1920&h=1280`,
    skyblue: `https://images.pexels.com/photos/531756/pexels-photo-531756.jpeg?w=1920&h=1281`,
    night: `https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?w=1920&h=1043`,
    sunset: `https://images.pexels.com/photos/165754/pexels-photo-165754.jpeg?w=1920&h=1280`,
  }
}

export const getRandomImage = (orientation: string | keyof typeof publicImageURLs = `horizontal`) => {
  let randomImage = publicImageURLs?.horizontal?.night;
  let imgsOrientation = publicImageURLs?.[orientation];
  if (imgsOrientation) {
    let imgsArray = Object.values(imgsOrientation);
    randomImage = getRandomArrayValue(imgsArray) ?? imgsArray?.[0];
  }
  return randomImage;
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