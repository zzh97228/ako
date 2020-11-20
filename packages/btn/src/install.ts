import {
  registerComponents,
  registerServices,
  ColorService,
  VariableService,
  VariableProps,
  ColorProps,
} from '@lagabu/shared';
import { App } from 'vue';
import { Btn } from './components';

export type BtnProps = { [props: string]: any } & ColorProps & VariableProps;
export function BtnPlugin(Vue: App, opts: BtnProps = {}) {
  registerComponents(Vue, {
    Btn,
  });
  registerServices(
    Vue,
    {
      ColorService,
      VariableService,
    },
    opts
  );
}
