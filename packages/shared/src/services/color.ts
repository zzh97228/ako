import { App } from 'vue';
import { StyleService } from './base';
export const defaultBaseColors = {
  'red-lighten': '#ffa39e',
  red: '#f5222d',
  'red-darken': '#a8071a',
  'blue-lighten': '#91d5ff',
  blue: '#1890ff',
  'blue-darken': '#0050b3',
  'cyan-lighten': '#87e8de',
  cyan: '#13c2c2',
  'cyan-darken': '#006d75',
  'green-lighten': '#b7eb8f',
  green: '#52c41a',
  'green-darken': '#237804',
  'yellow-lighten': '#fffb8f',
  yellow: '#fadb14',
  'yellow-darken': '#ad8b00',
  'black-lighten': '#bfbfbf',
  black: '#262626',
  'black-darken': '#000000',
  white: '#ffffff'
};
export const defaultThemeColors = {
  primary: defaultBaseColors['blue'],
  secondary: defaultBaseColors['blue-lighten'],
  success: defaultBaseColors['green'],
  error: defaultBaseColors['red'],
  warning: defaultBaseColors['yellow'],
};

export type ThemeColorType = { [props: string]: string } & typeof defaultThemeColors;
export type BaseColorType = { [props: string]: string } & typeof defaultBaseColors;
export type ColorType = {
  theme: ThemeColorType;
  base: BaseColorType;
};

export type ColorOptions = {
  theme?: Partial<ThemeColorType>;
  base?: Partial<BaseColorType>;
};
export type ColorProps = {
  color?: ColorOptions;
};

export class ColorService extends StyleService {
  themeColors: ThemeColorType;
  baseColors: BaseColorType;
  constructor(opts: ColorProps = {}) {
    super();
    const color = opts.color || {};
    this.themeColors = Object.assign({}, defaultThemeColors, color.theme) as ThemeColorType;
    this.baseColors = Object.assign({}, defaultBaseColors, color.base) as BaseColorType;
  }

  genColorClasses(key: string, isTheme = false) {
    const addon = isTheme ? '-color' : '',
      val = 'var(--' + key + addon + ')';
    return `\nbody .${key}-color {
      background-color: ${val};
      border-color: ${val};
    }
    body .${key}-color--text {
      color: ${val};
      caret-color: ${val};
    }\n
    `;
  }

  genStyleString() {
    let rootStr = `\n:root {\n`,
      classesStr = '\n',
      colorValue: string;
    for (let tk in this.themeColors) {
      if (Object.prototype.hasOwnProperty.call(this.themeColors, tk)) {
        colorValue = this.themeColors[tk];
        rootStr += `--${tk}-color: ${colorValue};\n`;
        classesStr += this.genColorClasses(tk, true);
      }
    }
    for (let bk in this.baseColors) {
      if (Object.prototype.hasOwnProperty.call(this.baseColors, bk)) {
        colorValue = this.baseColors[bk];
        rootStr += `--${bk}: ${colorValue};\n`;
        classesStr += this.genColorClasses(bk);
      }
    }
    rootStr += `\n}\n`;
    return rootStr + classesStr;
  }
  register(Vue: App) {
    super.register(Vue);
    Vue.config.globalProperties.$ako.$colors = {
      theme: this.themeColors,
      base: this.baseColors,
    };
  }
}
