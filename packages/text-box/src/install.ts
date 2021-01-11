import { ColorProps, registerComponents } from '@lagabu/shared';
import { App } from 'vue';
import { TextBox } from './components';
/**
 * @public
 */
export type TextBoxProps = { [prop: string]: any; prefix?: string } & ColorProps;
/**
 * @public
 * @param Vue - Vue Instance
 * @param opts - options
 */
export function TextBoxPlugin(Vue: App, opts: TextBoxProps = {}) {
  registerComponents(Vue, { TextBox }, opts.prefix);
}
