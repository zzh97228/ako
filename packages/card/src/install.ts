import { App } from 'vue';
import { registerComponents } from '@lagabu/shared';
import * as components from './components';

export function CardPlugin(Vue: App) {
  registerComponents(Vue, components);
}
