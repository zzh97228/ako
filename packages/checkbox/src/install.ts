import vue, { App } from 'vue';
import { registerComponents } from '@lagabu/shared';
import { Checkbox, CheckboxGroup } from './components';
/**
 * @public - checkbox plugin
 * @param Vue
 */
export function CheckboxPlugin(Vue: App) {
  registerComponents(Vue, {
    Checkbox,
    CheckboxGroup,
  });
}
