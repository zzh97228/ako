import { App, computed, ComputedRef, reactive } from 'vue';
import { convertToNumber, hasWindow } from '../utils/helpers';
import { StyleService } from './base';
export const defaultBreakpoints = {
  xs: '',
  sm: '',
  md: '',
  lg: '',
  xl: '',
};
export type BreakpointsType = { [props: string]: boolean } & {
  [T in keyof typeof defaultBreakpoints]: boolean;
};
export type BreakpointsOptions = {
  [T in keyof typeof defaultBreakpoints]: string | number;
};
export const defaultVariableOptions = {
  breakpoints: defaultBreakpoints,
};

export type VariableProps = {
  breakpoints?: Partial<BreakpointsOptions>;
};
export class VariableService extends StyleService {
  breakpoints: { [props: string]: string | number } & BreakpointsOptions;
  constructor(options: VariableProps = {}) {
    super();
    this.breakpoints = Object.assign({}, defaultBreakpoints, options.breakpoints);
  }

  genStyleString() {
    // TODO
    let rootStr = `\n:root{\n`,
      key: string,
      val: string,
      classesStr = `\n`;
    rootStr += `\n}\n`;
    return rootStr;
  }
  registerBreakpoints(Vue: App) {
    if (!hasWindow()) return;
    let size: number,
      windowSize = window.innerWidth;
    const self = this;
    const state = reactive(
      Object.keys(this.breakpoints).reduce((prev, next) => {
        size = convertToNumber(this.breakpoints[next]);
        prev[next] = windowSize < size;
        return prev;
      }, {} as BreakpointsType)
    );
    function onResize() {
      windowSize = window.innerWidth;
      for (let key in state) {
        if (Object.prototype.hasOwnProperty.call(self.breakpoints, key)) {
          size = convertToNumber(self.breakpoints[key]);
          state[key] = windowSize < size;
        }
      }
    }
    window.addEventListener('resize', onResize, false);
  }
  register(Vue: App) {
    super.register(Vue);
    this.registerBreakpoints(Vue);
  }
}
