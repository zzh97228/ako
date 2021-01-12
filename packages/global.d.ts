import vue from 'vue';
import { RippleRecord } from '@lagabu/shared';
declare global {
  interface Element {
    _expand_transition?: Record<string, any>;
  }
  interface HTMLElement {
    _ripple?: RippleRecord;
    _intersect?: any;
    _clickOutside?: any;
  }
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    // set custom global prop
  }
}
