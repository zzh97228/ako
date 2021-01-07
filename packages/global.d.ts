import vue from 'vue';
import { RippleRecord } from '@lagabu/shared';
declare global {
  interface HTMLElement {
    _ripple?: RippleRecord;
    _intersect?: any;
  }
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    // set custom global prop
  }
}
