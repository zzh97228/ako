import { defineComponent, h } from 'vue';

export default defineComponent({
  name: 'list-item',
  props: {
    disabled: Boolean,
  },
  setup(props, { slots }) {
    function onClick(e: Event) {
      if (props.disabled) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
    }
    return () =>
      h(
        'li',
        {
          class: 'list-item',
          onClick,
        },
        slots.default && slots.default()
      );
  },
});
