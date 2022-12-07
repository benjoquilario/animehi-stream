export const episodesTitle = (str: string) => {
  const removeSymbol = str.toLowerCase().replace(/[^a-zA-Z ]/g, '');
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

export const stripHtml = (data: string) => data.replace(/<\/?\w*\\?>/gm, '');

export function chunk<T>(arr: Array<T>, chunkSize: number) {
  let R = [];

  for (var i = 0; i < arr.length; i += chunkSize)
    R.push(arr.slice(i, i + chunkSize));

  return R;
}
