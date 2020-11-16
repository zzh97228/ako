import { computed, ExtractPropTypes } from 'vue';
import { isCssColor } from '../utils/helpers';

export const colorProps = {
  color: String,
};

export function useColor(props: ExtractPropTypes<typeof colorProps>, isTextColor?: boolean) {
  const classes = computed(() => {
    if (isCssColor(props.color)) return {};
    return {
      [`${props.color}-color${isTextColor ? '--text' : ''}`]: !!props.color
    };
  });

  const styles = computed(() => {
    if (!isCssColor(props.color)) return {};
    return {
      [`${isTextColor ? 'color' : 'background-color'}`]: props.color,
      [`${isTextColor ? 'caret-color' : 'border-color'}`]: props.color,
    };
  });

  return {
    class: classes,
    style: styles,
  };
}
