import { defineComponent, h } from 'vue';

export const Application = defineComponent({
  name: 'application',
  props: {
    tag: {
      type: String,
      default: 'div',
    },
  },
  setup(props, { slots }) {
    return () =>
      h(
        props.tag,
        {
          class: 'application',
        },
        h(
          'div',
          {
            class: 'application__content',
          },
          slots.default && slots.default()
        )
      );
  },
});
