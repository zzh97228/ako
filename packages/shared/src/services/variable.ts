import { App, computed, ComputedRef, reactive } from 'vue';
import { convertToNumber, hasWindow } from '../utils/helpers';
import { StyleService } from './base';
export const defaultBreakpoints = {
  xs: '',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px'
};
export type BreakpointsType = { [props: string]: boolean } & Omit<{
  [T in keyof typeof defaultBreakpoints]: boolean;
}, 'xs'>;
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
    return '';
  }
  registerBreakpoints(Vue: App) {
    if (!hasWindow()) return;
    let size: number,
      windowSize = window.innerWidth;
    const self = this;
    const state = reactive(
      Object.keys(this.breakpoints).reduce((prev, next) => {
        if (next === 'xs') {
          prev[next] = true
          return prev
        }
        size = convertToNumber(this.breakpoints[next]);
        prev[next] = windowSize >= size;
        return prev;
      }, {} as BreakpointsType)
    );
    function onResize() {
      windowSize = window.innerWidth;
      for (let key in state) {
        if (Object.prototype.hasOwnProperty.call(self.breakpoints, key)) {
          if (key === 'xs') {
            state[key] = true
            continue;
          }
          size = convertToNumber(self.breakpoints[key]);
          state[key] = windowSize >= size;
        }
      }
    }
    Vue.config.globalProperties.$ako.$breakpoints = state;
    window.addEventListener('resize', onResize, false);
  }
  register(Vue: App) {
    super.register(Vue);
    this.registerBreakpoints(Vue);
  }
}
