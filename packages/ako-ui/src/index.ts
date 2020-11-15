import { App } from 'vue';
import { registerComponents } from '@lagabu/shared';
import * as components from './components';
export default function Ako(Vue: App) {
  registerComponents(Vue, components, 'ako-');
}
