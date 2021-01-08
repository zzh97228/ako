import { genModelProps, useModel, useFieldProvider, useValidation, genValidationProps } from '@lagabu/shared';
import { computed, defineComponent, h } from 'vue';

export default defineComponent({
  name: 'field',
  props: {
    ...genModelProps([String, Number, Object, Boolean]),
    ...genValidationProps(),
    labelCol: [Number, String],
    inputCol: [Number, String],
  },
  setup(props, context) {
    const modelOptions = useModel(props, context);
    useFieldProvider(modelOptions);
    const { errors, hasError } = useValidation(props, context, modelOptions.lazyState);
    return {
      errors,
      hasError,
    };
  },
  methods: {
    genLabel() {
      return h(
        'div',
        {
          class: 'field__label',
        },
        this.$slots.label && this.$slots.label()
      );
    },
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
