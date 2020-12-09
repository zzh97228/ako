import { App } from 'vue';
import * as components from './components';
import { registerComponents } from '@lagabu/shared';

type InputOptions = { prefix?: string } & {};
export function InputPlugin(Vue: App, opts: InputOptions = {}) {
  registerComponents(Vue, components, opts.prefix);
}
