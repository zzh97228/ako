import { convertToNumber, convertToUnit, StyleService } from '@lagabu/shared';
import vue, { App } from 'vue';
/**
 * @public
 */
export const enum FlexEnum {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
}
/**
 * @public
 */
export const defaultColumns = 12;
/**
 * @public
 */
export type GridOptions = {
  columns?: string | number;
  gutters?: { [prop: string]: string | number } & {
    [T in FlexEnum]?: string | number;
  };
};
/**
 * @public
 */
export type GridType = {
  columns: number;
  gutters: {
    [T in FlexEnum]: string;
  };
};
/**
 * @public
 */
export type GridProps = {
  grid?: GridOptions;
};

/**
 * @public Grid Style Service
 */
export class GridService extends StyleService {
  columns: number;
  gutters: Record<string, string | number>;
  constructor(options: GridProps = {}) {
    super();
    const grid = options.grid || {};
    this.columns = convertToNumber(grid.columns);
    this.gutters = Object.assign({}, grid?.gutters);
  }
  makeCols(idx: number, percent: string | number, breakpoints?: string) {
    return `
    .col-${idx}${breakpoints ? '-' + breakpoints : ''} {
      flex: 0 0 ${percent}% !important;
      max-width: ${percent}% !important;
    }`;
  }

  genStyleString() {
    let rootStr = '',
      classesStr = '',
      percent: string | number = 100;
    if (this.columns) {
      rootStr += `--columns: ${this.columns} !important;\n`;
      // solve columns
      for (let i = 1; i <= this.columns; i++) {
        percent = (i * 100) / this.columns;
        classesStr += this.makeCols(i, percent) + '\n';
      }
    }

    for (let gKey in this.gutters) {
      // solve gutters
      if (!this.gutters[gKey]) continue;
      let value = convertToUnit(this.gutters[gKey]);
      if (!value) continue;
      value = value.replace(/^(-)/, '');
      const reverseValue = '-' + value;
      rootStr += `--gutter-${gKey}: ${value} !important;\n--gutter-${gKey}-reverse: ${reverseValue} !important;\n`;
    }
    if (!rootStr && !classesStr) return '';
    rootStr = `\n:root\n{${rootStr}\n}\n`;
    return rootStr + classesStr;
  }
  register(Vue: App) {
    super.register(Vue);
  }
}
