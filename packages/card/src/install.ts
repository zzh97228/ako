import { App } from 'vue';
import {
  ColorProps,
  ElevationProps,
  registerComponents,
  registerServices,
  ElevationService,
  ColorService,
} from '@lagabu/shared';
import { Card, CardTitle, CardContent, CardActions, CardSubtitle } from './components';

/**
 * @public card-plugin
 * @param Vue - Vue Instance
 * @param opts - ColorProps & ElevationProps
 */
export function CardPlugin(Vue: App, opts: { [props: string]: any & ColorProps & ElevationProps } = {}) {
  registerComponents(Vue, { Card, CardTitle, CardContent, CardActions, CardSubtitle });
  registerServices(
    Vue,
    {
      ElevationService,
      ColorService,
    },
    opts
  );
}
