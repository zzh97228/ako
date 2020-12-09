import { computed, ComputedRef, ExtractPropTypes, isRef } from 'vue';
import { isCssColor } from '../utils/helpers';
import { ThemeList } from '../services/color';

export function genColorProp(colorStr: string | null = 'primary') {
  return {
    color: {
      type: String,
      default: colorStr,
    },
  };
}

export function useColor(
  props: ExtractPropTypes<ReturnType<typeof genColorProp>>,
  isTextColor?: ComputedRef<boolean> | boolean
) {
  const classes = computed(() => {
    if (isCssColor(props.color)) return {};
    const isText = isRef(isTextColor) ? isTextColor.value : !!isTextColor;
    const isTheme = ThemeList.includes(props.color);
    return {
      [`${props.color}${isTheme ? '-color' : ''}${isText ? '--text' : ''}`]: !!props.color,
    };
  });

  const styles = computed(() => {
    if (!isCssColor(props.color)) return {};
    const isText = isRef(isTextColor) ? isTextColor.value : !!isTextColor;
    return {
      [`${isText ? 'color' : 'background-color'}`]: props.color,
      [`${isText ? 'caret-color' : 'border-color'}`]: props.color,
    };
  });

  return {
    class: classes,
    style: styles,
  };
}
