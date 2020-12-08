import vue from 'vue';
import { RippleRecord } from '@lagabu/shared';
declare global {
  interface HTMLElement {
    _ripple?: RippleRecord;
  }
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $ako?: {};
  }
}
