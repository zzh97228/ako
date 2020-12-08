import { registerComponents, registerServices, ColorService, ColorProps } from '@lagabu/shared';
import vue, { App } from 'vue';
import { Btn } from './components';

export type BtnProps = { [props: string]: any } & ColorProps;
export function BtnPlugin(Vue: App, opts: BtnProps = {}) {
  registerComponents(Vue, {
    Btn,
  });
  registerServices(
    Vue,
    {
      ColorService,
    },
    opts
  );
}
