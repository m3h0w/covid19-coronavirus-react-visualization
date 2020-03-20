import theme from 'theme';
// const Colors: { names?: { [key: string]: string }; random?: () => string } | undefined = {};

class Colors {
  defaultColor = '#000';

  colors = {
    aqua: '#00ffff',
    // azure: '#f0ffff',
    // beige: '#f5f5dc',
    black: '#000000',
    blue: '#0000ff',
    brown: '#a52a2a',
    cyan: '#00ffff',
    darkblue: '#00008b',
    darkcyan: '#008b8b',
    darkgrey: '#a9a9a9',
    darkgreen: '#006400',
    darkkhaki: '#bdb76b',
    darkmagenta: '#8b008b',
    darkolivegreen: '#556b2f',
    darkorange: '#ff8c00',
    darkorchid: '#9932cc',
    darkred: '#8b0000',
    darksalmon: '#e9967a',
    darkviolet: '#9400d3',
    fuchsia: '#ff00ff',
    gold: '#ffd700',
    green: '#008000',
    indigo: '#4b0082',
    // khaki: '#f0e68c',
    // lightblue: '#add8e6',
    // lightcyan: '#e0ffff',
    // lightgreen: '#90ee90',
    // lightgrey: '#d3d3d3',
    // lightpink: '#ffb6c1',
    // lightyellow: '#ffffe0',
    lime: '#00ff00',
    magenta: '#ff00ff',
    maroon: '#800000',
    navy: '#000080',
    olive: '#808000',
    orange: '#ffa500',
    pink: '#ffc0cb',
    purple: '#800080',
    violet: '#800080',
    red: '#ff0000',
    // silver: '#c0c0c0',
    // white: '#ffffff',
    // yellow: '#ffff00',
  };

  public getRandomColor() {
    let color = this.defaultColor;

    const colorKeys = Object.keys(this.colors);
    const length = colorKeys.length;
    if (length > 0) {
      const index = Math.floor(length * Math.random());

      const colorKey = colorKeys[index];

      color = this.colors[colorKey];
      delete this.colors[colorKey];
    }

    return color;
  }
}

export function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.replace('#', '');
  var r = parseInt(hexcolor.substr(0, 2), 16);
  var g = parseInt(hexcolor.substr(2, 2), 16);
  var b = parseInt(hexcolor.substr(4, 2), 16);
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? theme.palette.grey[800] : theme.palette.grey[200];
}

export default Colors;
