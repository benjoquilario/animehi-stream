import { TitleType } from 'types/types';

export function title(title: TitleType): string {
  return title?.userPreferred &&
    title.userPreferred !== title.english &&
    title.userPreferred.length > 14
    ? title.english || title.romaji
    : title.romaji || title.english;
}
