import { genModelProps, useModel, useFieldProvider } from '@lagabu/shared';
import { defineComponent, h } from 'vue';

export default defineComponent({
  name: 'field',
  props: {
    ...genModelProps([String, Number, Object]),
    rules: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, context) {
    // TODO hope to have validation;
    const modelOptions = useModel(props, context);
    useFieldProvider(modelOptions);
  },
  methods: {
    genContent() {
      return h(
        'div',
        {
          class: 'field__content',
        },
        this.$slots.default && this.$slots.default()
      );
    },
    genAddon() {
      return h('div', {
        class: 'field__addon',
      });
    },
  },
  render() {
    return h(
      'div',
      {
        class: 'field__wrapper',
      },
      [this.genContent(), this.genAddon()]
    );
  },
});
