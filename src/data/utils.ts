import { US_NAME, SOUTH_KOREA } from '../utils/consts';
export const namesMap = {
  US: US_NAME,
  'Korea, South': SOUTH_KOREA,
  'Bahamas, The': 'Bahamas',
  [`Cote d'Ivoire`]: 'Ivory Coast',
  'Gambia, The': 'Gambia',
};
export const swapName = (name: string): string => {
  if (!Object.keys(namesMap).includes(name)) {
    throw new Error(`Tried to swap a country that doesn't exist in the namesMap`);
  }
  return namesMap[name];
};
