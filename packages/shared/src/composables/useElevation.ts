import { computed, ExtractPropTypes } from 'vue';
const elevationParams = ['xs', 'sm', 'md', 'lg', 'xl'];
export function genElevationProp(defaultStr: string | null = 'xs') {
  return {
    elevation: {
      type: String,
      default: defaultStr,
    },
  };
}
export function useElevation(props: ExtractPropTypes<ReturnType<typeof genElevationProp>>) {
  const classes = computed(() => {
    if (!props.elevation || !elevationParams.includes(props.elevation)) return {};
    return {
      [`elevation-${props.elevation}`]: !!props.elevation,
    };
  });

  const styles = computed(() => {
    if (!props.elevation || elevationParams.includes(props.elevation)) return {};
    return {
      'box-shadow': props.elevation,
    };
  });

  return {
    class: classes,
    style: styles,
  };
}
