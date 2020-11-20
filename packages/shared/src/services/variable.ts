import { App, computed, ComputedRef, reactive } from 'vue';
import { convertToNumber, hasWindow } from '../utils/helpers';
import { StyleService } from './base';
export const defaultBreakpoints = {
  xs: '',
  sm: '576px',
  md: '768px',
  lg: '992px',
  xl: '1200px',
};
export const defaultElevation = {
  xs: '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)',
  sm: '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12)',
  md: '0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)',
  lg: '0px 6px 7px -4px rgba(0, 0, 0, 0.2), 0px 11px 15px 1px rgba(0, 0, 0, 0.14), 0px 4px 20px 3px rgba(0, 0, 0, 0.12)',
};
export type VariableTemplateOptions<T extends object, V = any> = {
  [U in keyof T]: V;
};
export type BreakpointsType = { [props: string]: boolean } & {
  [T in keyof typeof defaultBreakpoints]: boolean;
};
export type ElevationOptions = VariableTemplateOptions<typeof defaultElevation, string>;
export type BreakpointsOptions = VariableTemplateOptions<Omit<typeof defaultBreakpoints, 'xs'>, string | number>;

export const defaultVariableOptions = {
  breakpoints: defaultBreakpoints,
  elevation: defaultElevation,
};

export type VariableProps = {
  breakpoints?: Partial<BreakpointsOptions>;
  elevation?: Partial<ElevationOptions>;
};
export class VariableService extends StyleService {
  breakpoints: { [props: string]: string | number } & BreakpointsOptions;
  elevation: { [props: string]: string | number } & ElevationOptions;
  constructor(options: VariableProps = {}) {
    super();
    this.breakpoints = Object.assign({}, defaultBreakpoints, options.breakpoints);
    this.elevation = Object.assign({}, defaultElevation, options.elevation);
  }

  genStyleString() {
    let rootStr = `\n:root{\n`,
      classesStr = '';
    for (let key in this.elevation) {
      if (!this.elevation[key]) continue;
      rootStr += `--elevation-${key}: ${this.elevation[key]};\n`;
      classesStr += `\n.elevation-${key}{
        box-shadow: var(--elevation-${key});
      }\n`;
    }
    rootStr += '\n}\n';
    return rootStr + classesStr;
  }
  registerBreakpoints(Vue: App) {
    let size: number,
      windowSize = 0;
    const self = this;
    const state = reactive(
      Object.keys(self.breakpoints).reduce((prev, next) => {
        prev[next] = false;
        return prev;
      }, {} as BreakpointsType)
    );
    function onResize() {
      if (!hasWindow()) return;
      windowSize = window.innerWidth;
      for (let key in state) {
        if (Object.prototype.hasOwnProperty.call(self.breakpoints, key)) {
          if (key === 'xs') {
            state[key] = true;
            continue;
          }
          size = convertToNumber(self.breakpoints[key]);
          state[key] = windowSize >= size;
        }
      }
    }
    Vue.config.globalProperties.$ako.$breakpoints = state;
    Vue.mixin({
      mounted() {
        onResize();
        window.addEventListener('resize', onResize, false);
      },
      beforeUnmount() {
        window.removeEventListener('resize', onResize, false);
      },
    });
  }
  register(Vue: App) {
    super.register(Vue);
    this.registerBreakpoints(Vue);
  }
}
