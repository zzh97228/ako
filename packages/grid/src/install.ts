import { registerServices, VariableService, VariableProps, registerComponents } from '@lagabu/shared';
import { GridService, GridProps } from './services';
import { Column, Row, Container } from './components';
import { App } from 'vue';

export type GridPluginOptions = { [props: string]: any; prefix?: string } & GridProps & VariableProps;
export function GridPlugin(Vue: App, opts: GridPluginOptions = {}) {
  registerServices(
    Vue,
    {
      GridService,
      VariableService,
    },
    opts
  );
  registerComponents(
    Vue,
    {
      Row,
      Column,
      Container
    },
    opts.prefix
  );
}
