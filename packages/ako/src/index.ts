import vue, { App } from 'vue';
import { registerServices, registerComponents, registerDirectives, ColorProps } from '@lagabu/shared';
import { GridProps } from '@lagabu/grid';
import * as components from './components';
import * as directives from './directives';
import * as services from './services';
export type AkoOptions = { [prop: string]: any } & ColorProps & GridProps;
export default {
  install(Vue: App, opts: AkoOptions = {}) {
    registerComponents(Vue, components, 'ako-');
    registerServices(Vue, services, opts);
    registerDirectives(Vue, directives);
  },
};
