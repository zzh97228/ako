import vue, { defineComponent, h } from 'vue';

export default defineComponent({
  name: 'divider',
  props: {
    vertical: Boolean,
  },
  setup(props) {
    return () =>
      h(
        'div',
        {
          class: {
            divider__wrapper: true,
            'divider--vertical': props.vertical,
          },
        },
        h('div', {
          class: 'divider',
        })
      );
  },
});
