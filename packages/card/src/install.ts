import { App } from 'vue';
import { registerComponents } from '@lagabu/shared';
import { Card } from './components';

export function CardPlugin(Vue: App, opts = {}) {
  registerComponents(Vue, {
    Card
  });
}
