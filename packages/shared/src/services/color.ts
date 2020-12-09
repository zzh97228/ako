import vue from 'vue';
import { StyleService } from './base';
export const enum ThemeEnum {
  primary = 'primary',
  success = 'success',
  warning = 'warning',
  error = 'error',
}
export const ThemeList: Array<ThemeEnum | string> = [
  ThemeEnum.primary,
  ThemeEnum.success,
  ThemeEnum.error,
  ThemeEnum.warning,
];
export type ThemeColorType = { [props: string]: string } & {
  [T in ThemeEnum]: string;
};
export type BasicColors =
  | 'red-0'
  | 'red-1'
  | 'red-2'
  | 'red-3'
  | 'red-4'
  | 'red-5'
  | 'red-6'
  | 'red-7'
  | 'red-8'
  | 'red-9'
  | 'blue-0'
  | 'blue-1'
  | 'blue-2'
  | 'blue-3'
  | 'blue-4'
  | 'blue-5'
  | 'blue-6'
  | 'blue-7'
  | 'blue-8'
  | 'blue-9'
  | 'green-0'
  | 'green-1'
  | 'green-2'
  | 'green-3'
  | 'green-4'
  | 'green-5'
  | 'green-6'
  | 'green-7'
  | 'green-8'
  | 'green-9'
  | 'yellow-0'
  | 'yellow-1'
  | 'yellow-2'
  | 'yellow-3'
  | 'yellow-4'
  | 'yellow-5'
  | 'yellow-6'
  | 'yellow-7'
  | 'yellow-8'
  | 'yellow-9';

export type BasicColorType = { [props: string]: string } & {
  [T in BasicColors]: string;
};
export type ColorType = {
  theme: ThemeColorType;
  basic: BasicColorType;
};

export type ColorOptions = {
  theme?: Partial<ThemeColorType>;
  basic?: Partial<BasicColorType>;
};
export type ColorProps = {
  color?: ColorOptions;
};

export class ColorService extends StyleService {
  themeColors: ThemeColorType;
  basicColors: BasicColorType;
  constructor(opts: ColorProps = {}) {
    super();
    const color = opts.color || {};
    this.themeColors = Object.assign({}, color.theme) as ThemeColorType;
    this.basicColors = Object.assign({}, color.basic) as BasicColorType;
  }

  genColorClasses(key: string, isTheme = false) {
    const addon = isTheme ? '-color' : '',
      val = 'var(--' + key + addon + ')';
    return `body .${key}${addon} {
      background-color: ${val};
      border-color: ${val};
    }
    body .${key}${addon}--text {
      color: ${val};
      caret-color: ${val};
    }\n
    `;
  }

  genStyleString() {
    let rootStr = '',
      classesStr = '',
      colorValue: string;
    for (let tk in this.themeColors) {
      if (this.themeColors[tk]) {
        colorValue = this.themeColors[tk];
        rootStr += `--${tk}-color: ${colorValue} !important;\n`;
        classesStr += this.genColorClasses(tk, true);
      }
    }
    for (let bk in this.basicColors) {
      if (this.basicColors[bk]) {
        colorValue = this.basicColors[bk];
        rootStr += `--${bk}: ${colorValue} !important;\n`;
        classesStr += this.genColorClasses(bk);
      }
    }
    if (!rootStr && !classesStr) return '';
    rootStr = `\n:root{\n${rootStr}\n}\n`;
    return rootStr + classesStr;
  }
}
