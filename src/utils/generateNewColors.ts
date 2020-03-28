import ColorScheme from 'color-scheme';
import getRandomFromRange from './getRandomFromRange';
import shuffleArray from './shuffleArray';
import rgbToHsl from './rgbToHsl';

const newColorScheme = () => {
  var scheme = new ColorScheme();
  scheme
    .from_hue(getRandomFromRange(0, 100))
    .scheme('tetrade')
    .distance(0.8)
    .variation('hard');
  var colors = shuffleArray(scheme.colors());
  return colors;
};

const generateNewColors = (length: number): string[] => {
  if (!length) {
    return [];
  }
  const array = [];
  let mainCounter = 0;
  let moduloCounter = 0;
  let colors = newColorScheme();
  while (colors.length && array.length < length && mainCounter < length * 10) {
    moduloCounter = mainCounter % colors.length;
    if (moduloCounter === 0) {
      colors = shuffleArray(colors);
    }
    const colorHex = `#${colors[moduloCounter]}`;
    const [h, s, l] = rgbToHsl(colorHex);
    if (mainCounter < colors.length * 4) {
      if (l < 0.9) {
        array.push(colorHex);
        colors.splice(moduloCounter, 1);
      }
    } else {
      colors = newColorScheme();
    }
    mainCounter += 1;
  }

  if (mainCounter >= length * 10) {
    throw new Error(`Failed generating colors for length: ${length}`);
  }

  if (array.length !== length) {
    console.error('Didnt generate enough colors', array.length, length);
  }

  return array;
};

export default generateNewColors;
