import { sizeProps, genColorProp, useSize, useColor, genElevationProp, useElevation } from '@lagabu/shared';
import { defineComponent, h, mergeProps } from 'vue';

export default defineComponent({
  name: 'list',
  props: {
    ...sizeProps,
    ...genColorProp('primary'),
    ...genElevationProp(),
    disabled: Boolean,
  },
  setup(props, context) {
    const { slots } = context;
    const { sizeStyle } = useSize(props);
    const { class: elevationClasses, style: elevationsStyles } = useElevation(props);
    const { class: colorClasses, style: colorStyles } = useColor(props, true);
    function onClick(e: Event) {
      if (props.disabled) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
    }
    return () =>
      h(
        'ul',
        mergeProps(
          {
            class: 'list',
            style: sizeStyle.value,
            onClick,
          },
          {
            class: colorClasses.value,
            style: colorStyles.value,
          },
          {
            class: elevationClasses.value,
            style: elevationsStyles.value,
          }
        ),
        slots.default && slots.default()
      );
  },
});
