import { App } from 'vue';
import { registerComponents, registerServices, registerDirectives } from '@lagabu/shared';
import { components } from './components';
import { services, AkoProps } from './services';
import { directives } from './directives';
export default function Ako(Vue: App, opts: AkoProps = {}) {
  registerComponents(Vue, components, 'ako-');
  registerServices(Vue, services, opts);
  registerDirectives(Vue, directives);
}
