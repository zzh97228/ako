import {
  registerComponents,
  registerServices,
  ColorService,
  ColorProps,
  ElevationProps,
  ElevationService,
} from '@lagabu/shared';
import vue, { App } from 'vue';
import { Btn, BtnToggleGroup } from './components';

export type BtnProps = { [props: string]: any } & ColorProps & ElevationProps;
export function BtnPlugin(Vue: App, opts: BtnProps = {}) {
  registerComponents(Vue, {
    Btn,
    BtnToggleGroup
  });
  registerServices(
    Vue,
    {
      ColorService,
      ElevationService,
    },
    opts
  );
}
