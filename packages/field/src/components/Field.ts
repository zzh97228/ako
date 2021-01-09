import { genModelProps, useModel, useFieldProvider, useValidation, genValidationProps, isString } from '@lagabu/shared';
import vue, { defineComponent, h, VNodeArrayChildren, vShow, withDirectives } from 'vue';

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
    const { isFocusing, hasFocus } = useFieldProvider(modelOptions);
    const { errors, hasError } = useValidation(props, context, modelOptions.lazyState, hasFocus, isFocusing);
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
    genAddonContent(addonChidlren?: VNodeArrayChildren) {
      return h(
        'div',
        {
          class: 'field__addon',
        },
        addonChidlren ||
          this.errors
            .filter((e) => isString(e.error))
            .sort((a, b) => a.index - b.index)
            .map((e, idx) => {
              return h(
                'div',
                {
                  class: 'field__addon-item',
                  key: 'error-' + idx,
                },
                String(e.error)
              );
            })
      );
    },
    genAddon() {
      return withDirectives(this.genAddonContent(this.$slots.addon && this.$slots.addon()), [[vShow, this.hasError]]);
    },
  },
  render() {
    return h(
      'div',
      {
        class: 'field__wrapper',
      },
      [this.genLabel(), this.genContent()]
    );
  },
});
