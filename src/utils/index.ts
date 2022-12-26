import dayjs from './time';

export const episodesTitle = (str: string) => {
  const removeSymbol = str.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '');
  const splitEpisode = removeSymbol.split(' ');
  const episode = splitEpisode.join('-');
  return episode;
};

export const extractEpisode = (x: string | number) => {
  let num;

  if (typeof x === 'string') {
    const str = x?.split('-');
    const episode = str[str.length - 1];
    num = Number(episode);
  }

  return num;
};

export const stripHtml = (data: string) => data?.replace(/<\/?\w*\\?>/gm, '');

export function chunk<T>(arr: Array<T>, chunkSize: number) {
  let R = [];

  for (var i = 0; i < arr.length; i += chunkSize)
    R.push(arr.slice(i, i + chunkSize));

  return R;
}

export const parseData = (data: any) => JSON.parse(JSON.stringify(data));
export const encodedURI = (data: string[]) =>
  encodeURIComponent(JSON.stringify(data));

export const getSeason = () => {
  const month = dayjs().month();
  const year = dayjs().year();

  let season = 'WINTER';

  if (3 <= month && month <= 5) {
    season = 'SPRING';
  }

  if (6 <= month && month <= 8) {
    season = 'SUMMER';
  }

  if (9 < month && month <= 11) {
    season = 'FALL';
  }

  return {
    season,
    year,
  };
};

export const getFromStorage = (key: string) => {
  if (typeof window !== undefined) {
    return localStorage.getItem(key);
  }
};

export const setStorage = (key: string, value: any) => {
  if (typeof window !== undefined) {
    return localStorage.setItem(key, value);
  }
};
