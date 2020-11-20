import { computed, ComputedRef, ExtractPropTypes, isRef } from 'vue';
import { isCssColor } from '../utils/helpers';

export function genColorProp(colorStr: string | null = 'primary') {
  return {
    color: {
      type: String,
      default: colorStr
    }
  }
}

export function useColor(props: ExtractPropTypes<ReturnType<typeof genColorProp>>, isTextColor?: ComputedRef<boolean> | boolean) {
  const classes = computed(() => {
    if (isCssColor(props.color)) return {};
    const isText = isRef(isTextColor) ? isTextColor.value : !!isTextColor;
    return {
      [`${props.color}-color${isText ? '--text' : ''}`]: !!props.color,
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
