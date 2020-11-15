import { registerServices } from '@lagabu/shared';
import { GridService } from './services';
import { App } from 'vue';

export function GridPlugin(Vue: App, opts = {}) {
  registerServices(
    Vue,
    {
      GridService,
    },
    opts
  );
}
