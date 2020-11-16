import { defineComponent, h } from 'vue';
import { useSize, sizeProps } from '@lagabu/shared';

export const Card = defineComponent({
  name: 'card',
  props: {
    tag: {
      type: String,
      default: 'div',
    },
    ...sizeProps,
  },
  setup(props, { slots }) {
    const { sizeStyle } = useSize(props);
    return () =>
      h(
        props.tag,
        {
          class: 'card',
          style: sizeStyle.value,
        },
        slots.default && slots.default()
      );
  },
});
