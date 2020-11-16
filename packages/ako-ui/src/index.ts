import { App } from 'vue';
import { registerComponents, registerServices } from '@lagabu/shared';
import { components } from './components';
import { services, AkoProps } from './services';
export default function Ako(Vue: App, opts: AkoProps = {}) {
  registerComponents(Vue, components, 'ako-');
  registerServices(Vue, services, opts);
}
