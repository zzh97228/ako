import { defineComponent, h } from 'vue';
export default defineComponent({
  name: 'Message',
  methods: {
    genPrefix() {
      return h(
        'div',
        {
          class: 'message__prefix',
        },
        this.$slots.prefix && this.$slots.prefix()
      );
    },
    genSuffix() {
      return h(
        'div',
        {
          class: 'message__suffix',
        },
        this.$slots.suffix && this.$slots.suffix()
      );
    },
    genContent() {
      return h(
        'div',
        {
          class: 'message',
        },
        this.$slots.default && this.$slots.default()
      );
    },
  },
  render() {
    return h(
      'div',
      {
        ref: 'messageRef',
        class: 'message__wrapper',
      },
      [this.genPrefix(), this.genContent(), this.genSuffix()]
    );
  },
});
