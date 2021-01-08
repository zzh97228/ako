import vue, { defineComponent, h } from 'vue';

export default defineComponent({
  name: 'dropdown',
  setup() {},
  methods: {
    genActivator() {
      if (this.$slots.activator) {
        return this.$slots.activator();
      }
      return h('div', {
        class: 'dropdown__activator',
      });
    },
    genContent() {
      return h(
        'div',
        {
          class: 'dropdown__content',
        },
        this.$slots.default && this.$slots.default()
      );
    },
  },
  render() {
    return h(
      'div',
      {
        class: 'dropdown__wrapper',
      },
      [this.genActivator(), this.genContent()]
    );
  },
});
