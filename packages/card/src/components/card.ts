import vue from 'vue';
import { defineComponent, h, mergeProps, computed } from 'vue';
import { useSize, sizeProps, useColor, useElevation, genElevationProp, genColorProp } from '@lagabu/shared';

export default defineComponent({
  name: 'card',
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    outlined: Boolean,
    flat: Boolean,
    tile: Boolean,
    ...genElevationProp(),
    ...sizeProps,
    ...genColorProp(),
  },
  setup(props, { slots }) {
    const { sizeStyle } = useSize(props);
    const elevation = useElevation(props);
    const color = useColor(props);
    const classes = computed(() => {
      return {
        card: true,
        'card--outlined': props.outlined,
        'card--flat': props.flat,
        'card--tile': props.tile,
      };
    });
    return () =>
      h(
        props.tag,
        mergeProps(
          {
            class: classes.value,
            style: sizeStyle.value,
          },
          {
            class: color.class.value,
            style: color.style.value,
          },
          {
            class: elevation.class.value,
            style: elevation.style.value,
          }
        ),
        slots.default && slots.default()
      );
  },
});
