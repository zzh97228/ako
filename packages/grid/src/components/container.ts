import { useSize, sizeProps } from '@lagabu/shared';
import vue, { defineComponent, h } from 'vue';

export default defineComponent({
  name: 'container',
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    fluid: Boolean,
    ...sizeProps,
  },
  setup(props, { slots }) {
    const { sizeStyle: style } = useSize(props);
    return () =>
      h(
        props.tag,
        {
          class: {
            container: true,
            'container--fluid': props.fluid,
          },
          style: style.value,
        },
        slots.default && slots.default()
      );
  },
});
