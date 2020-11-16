import { convertToNumber, convertToUnit, StyleService } from '@lagabu/shared';
import { App } from 'vue';
export const defaultGridOptions = {
  columns: 12,
  gutter: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
  },
};
export type GridOptions = {
  columns: string | number;
  gutter: {
    [T in keyof typeof defaultGridOptions['gutter']]?: string | number
  }
};
export type GridType = typeof defaultGridOptions;
export type GridProps = {
  grid?: Partial<GridOptions>;
};
export class GridService extends StyleService {
  columns: number;
  gutter: Record<string, string | number>;
  constructor(options: GridProps = {}) {
    super();
    const grid = options.grid || defaultGridOptions
    this.columns = convertToNumber(grid.columns) || defaultGridOptions.columns;
    // force to be odd number
    this.columns = this.columns % 2 !== 0 ? this.columns + 1 : this.columns;
    this.gutter = Object.assign({}, defaultGridOptions.gutter, grid.gutter);
  }
  genStyleString() {
    let rootStr = `\n:root{
      --grid-columns: ${this.columns};\n`,
      classesStr = '\n',
      percent = 100;
    for (let i = 1; i <= this.columns; i++) {
      percent = (i * 100) / this.columns;
      classesStr += `\n
      .row > .col-${i} {
        flex: 0 0 ${percent}%;
        max-width: ${percent}%;
      }`;
    }

    for (let gKey in this.gutter) {
      let value = convertToUnit(this.gutter[gKey]);
      if (!value) continue;
      value = value.replace(/^(-)/, '');
      const reverseValue = '-' + value;
      rootStr += `--gutter-${gKey}: ${value};\n--gutter-${gKey}-reverse: ${reverseValue};\n`
    }
    rootStr += '\n}\n'
    return rootStr + classesStr;
  }
  register(Vue: App) {
    super.register(Vue);
  }
}
