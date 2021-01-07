import vue, { App } from 'vue';
import { registerServices, registerComponents } from '@lagabu/shared';
import { GridService, GridProps } from './services';
import { Col, Row, Container } from './components';

/**
 * @public
 */
export type GridPluginOptions = { [props: string]: any; prefix?: string } & GridProps;
/**
 * @public Grid Plugin
 * @param Vue - Vue Instance
 * @param opts - prefix, grid options
 */
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
      Col,
      Container,
    },
    opts.prefix
  );
}
