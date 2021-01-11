import { defineComponent, h } from 'vue';

export default defineComponent({
  name: 'list-subgroup',
  props: {
    disabled: Boolean,
  },
  setup(props, context) {
    const { slots } = context;

    function onClickActivator(e: Event) {
      if (props.disabled) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
    }

    function genActivator() {
      return h(
        'div',
        {
          class: 'list-subgroup__activator',
          onClick: onClickActivator,
        },
        slots.activator && slots.activator()
      );
    }

    function genContent() {
      return h(
        'ul',
        {
          class: 'list-subgroup__content',
        },
        slots.default && slots.default()
      );
    }

    return () =>
      h(
        'li',
        {
          class: 'list-subgroup',
        },
        [genActivator(), genContent()]
      );
  },
});
