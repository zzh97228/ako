import {
  genModelProps,
  useModel,
  useFieldProvider,
  useValidation,
  genValidationProps,
  isString,
  convertToNumber,
  useExpandTransition,
} from '@lagabu/shared';
import vue, { defineComponent, h, Transition, VNodeArrayChildren, vShow, withDirectives } from 'vue';
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
    const transitionProps = useExpandTransition();
    const { isFocusing, hasFocus, bindHasError } = useFieldProvider(modelOptions);
    const { errors, hasError } = useValidation(props, context, modelOptions.lazyState, hasFocus, isFocusing);

    // bind validation error
    bindHasError(hasError);

    return {
      errors,
      hasError,
      transitionProps,
    };
  },
  methods: {
    genLabel() {
      return h(
        'div',
        {
          class: {
            field__label: true,
            [`field__label-col-${this.labelCol}`]: convertToNumber(this.labelCol),
          },
        },
        this.$slots.label && this.$slots.label()
      );
    },
    genContent() {
      return h(
        'div',
        {
          class: {
            field__content: true,
            [`field__content-col-${this.inputCol}`]: convertToNumber(this.inputCol),
          },
        },
        [this.$slots.default && this.$slots.default(), this.genAddon()]
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
      return h(Transition, this.transitionProps, {
        default: () =>
          withDirectives(this.genAddonContent(this.$slots.addon && this.$slots.addon()), [[vShow, this.hasError]]),
      });
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
