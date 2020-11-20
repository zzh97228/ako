import {} from 'vue';
import { ColorType, BreakpointsType, RippleRecord } from '@lagabu/shared';
import { GridType } from '@lagabu/grid';
declare global {
  interface HTMLElement {
    _ripple?: RippleRecord;
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
