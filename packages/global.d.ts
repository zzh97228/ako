import {} from 'vue';
import { ColorType, BreakpointsType } from '@lagabu/shared';
import { GridType } from '@lagabu/grid';
declare global {
  interface HTMLElement {
    _observer?: any;
  }
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $ako?: {
      $colors?: ColorType;
      $breakpoints?: BreakpointsType;
    };
  }
}
