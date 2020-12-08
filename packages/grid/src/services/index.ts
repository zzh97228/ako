import { convertToNumber, convertToUnit, StyleService } from '@lagabu/shared';
import vue, { App } from 'vue';
export const enum FlexEnum {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
}
export const defaultColumns = 12;
export type GridOptions = {
  columns?: string | number;
  gutters?: { [prop: string]: string | number } & {
    [T in FlexEnum]?: string | number;
  };
  breakpoints?: { [prop: string]: string | number } & {
    [T in FlexEnum]?: string | number;
  };
};
export type GridType = {
  columns: number;
  gutters: {
    [T in FlexEnum]: string;
  };
  breakpoints: {
    [T in FlexEnum]: string;
  };
};
export type GridProps = {
  grid?: GridOptions;
};
export class GridService extends StyleService {
  columns: number;
  gutters: Record<string, string | number>;
  breakpoints: GridOptions['breakpoints'];
  constructor(options: GridProps = {}) {
    super();
    const grid = options.grid || {};
    this.columns = convertToNumber(grid.columns);
    this.gutters = Object.assign({}, grid?.gutters);
    this.breakpoints = Object.assign({}, grid?.breakpoints);
  }
  makeCols(idx: number, percent: string | number, breakpoints?: string) {
    return `
    .row > .col-${idx}${breakpoints ? '-' + breakpoints : ''} {
      flex: 0 0 ${percent}%;
      max-width: ${percent}%;
    }`;
  }

  makeMediaBreakpoints(bKey: string, bVal: string): string {
    const columns = this.columns || defaultColumns;
    let result = '',
      percent: string | number;
    for (let i = 1; i <= columns; i++) {
      percent = (i * 100) / columns;
      result += `
      @media screen and (min-width: ${bVal}) {
        ${this.makeCols(i, percent, bKey)}
      }`;
    }

    return result;
  }

  genStyleString() {
    let rootStr = '',
      classesStr = '',
      percent: string | number = 100;
    if (this.columns) {
      // solve columns
      for (let i = 1; i <= this.columns; i++) {
        percent = ((i * 100) / this.columns).toFixed(4);
        classesStr += this.makeCols(i, percent) + '\n';
      }
    }

    let bp: string | undefined;
    for (let bKey in this.breakpoints) {
      // solve breakpoints
      bp = convertToUnit(this.breakpoints[bKey]);
      if (!bp) continue;
      classesStr += this.makeMediaBreakpoints(bKey, bp) + '\n';
    }

    for (let gKey in this.gutters) {
      // solve gutters
      if (!this.gutters[gKey]) continue;
      let value = convertToUnit(this.gutters[gKey]);
      if (!value) continue;
      value = value.replace(/^(-)/, '');
      const reverseValue = '-' + value;
      rootStr += `--gutter-${gKey}: ${value};\n--gutter-${gKey}-reverse: ${reverseValue};\n`;
    }
    if (!rootStr && !classesStr) return '';
    rootStr = `\n:root\n{${rootStr}\n}\n`;
    return rootStr + classesStr;
  }
  register(Vue: App) {
    super.register(Vue);
  }
}
