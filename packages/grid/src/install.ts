import vue, { App } from 'vue';
import { registerServices, registerComponents } from '@lagabu/shared';
import { GridService, GridProps } from './services';
import { Col, Row, Container } from './components';

export type GridPluginOptions = { [props: string]: any; prefix?: string } & GridProps;
export function GridPlugin(Vue: App, opts: GridPluginOptions = {}) {
  registerServices(
    Vue,
    {
      GridService,
    },
    opts
  );
  registerComponents(
    Vue,
    {
      Row,
      Column: Col,
      Container,
    },
    opts.prefix
  );
}
