import { US_NAME, SOUTH_KOREA } from '../utils/consts';
export const namesMap = {
  US: US_NAME,
  'Korea, South': SOUTH_KOREA,
  'Bahamas, The': 'Bahamas',
  [`Cote d'Ivoire`]: 'Ivory Coast',
  'Gambia, The': 'Gambia',
  'Taiwan*': 'Taiwan',
};
export const swapName = (name: string): string => {
  if (!Object.keys(namesMap).includes(name)) {
    return name;
  }
  return namesMap[name];
};
