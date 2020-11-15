import { convertToNumber, convertToUnit, StyleService } from '@lagabu/shared';
import { App } from 'vue';
export const defaultGridOptions = {
  columns: 12,
  padding: '4px',
};
export type GridOptions = {
  [T in keyof typeof defaultGridOptions]: string | number;
};
export type GridType = typeof defaultGridOptions;
export type GridProps = {
  grid?: Partial<GridOptions>;
};
export class GridService extends StyleService {
  gridOptions: GridOptions;
  columns: number;
  padding: string;
  constructor(options: GridProps = {}) {
    super();
    this.gridOptions = Object.assign({}, defaultGridOptions, options.grid);
    this.columns = convertToNumber(this.gridOptions.columns) || defaultGridOptions.columns;
    // force to be odd number
    this.columns = this.columns % 2 !== 0 ? this.columns + 1 : this.columns;
    this.padding = convertToUnit(this.gridOptions.padding) || '0px';
  }
  genStyleString() {
    return `\n:root{
      --grid-columns: ${this.columns};
      --grid-padding: ${this.padding};
    }\n`;
  }
  register(Vue: App) {
    super.register(Vue);
    Vue.config.globalProperties.$ako.$grid = {
      padding: this.padding,
      columns: this.columns,
    };
  }
}
