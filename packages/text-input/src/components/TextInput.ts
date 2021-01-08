import vue, { computed, defineComponent, h, mergeProps, reactive, ref, VNodeArrayChildren } from 'vue';
import { useModel, genModelProps, useFieldConsumer, genColorProp, useColor } from '@lagabu/shared';

export default defineComponent({
  name: 'TextInput',
  props: {
    small: Boolean,
    large: Boolean,
    flat: Boolean,
    placeholder: String,
    disabled: Boolean,
    prefixDivider: Boolean,
    suffixDivider: Boolean,
    ...genModelProps([String, Number]),
    ...genColorProp(),
  },
  setup(props, context) {
    const { emit } = context;
    const { class: colorClasses, style: colorStyles } = useColor(props, true);
    const { model, lazyState, setInnerState } = useModel(props, context);
    useFieldConsumer({ model, lazyState, setInnerState });
    const inputRef = ref<null | HTMLInputElement>(null);
    const state = reactive({
      isComposing: false,
      isFocusing: false,
    });
    const onInput = (e: InputEvent) => {
      if (state.isComposing) return;
      const target = e.target as HTMLInputElement;
      model.value = target.value;
      return target.value;
    };

    const genInput = () =>
      h('input', {
        class: 'text-input__content',
        type: 'text',
        ref: inputRef,
        disabled: props.disabled,
        value: lazyState.value,
        placeholder: props.placeholder,
        onCompositionstart: () => {
          state.isComposing = true;
        },
        onCompositionend: () => {
          state.isComposing = false;
        },
        onFocus: () => {
          state.isFocusing = true;
        },
        onBlur: () => {
          state.isFocusing = false;
        },
        onChange: (e: InputEvent) => {
          if (props.disabled) {
            e.preventDefault();
            e.stopImmediatePropagation();
            return;
          }
        },
        onInput: (e: InputEvent) => {
          if (props.disabled) {
            e.preventDefault();
            e.stopImmediatePropagation();
            return;
          }
          onInput(e);
          emit('input', e, onInput);
        },
      });

    function createAddonSlot(className: string, prefix: boolean) {
      return (children?: VNodeArrayChildren) =>
        h(
          'div',
          {
            class: {
              [className]: true,
              'text-input--divider': prefix ? props.prefixDivider : props.suffixDivider,
            },
          },
          children
        );
    }

    return {
      genInput,
      genInputPrefix: createAddonSlot('text-input__prefix', true),
      genInputSuffix: createAddonSlot('text-input__suffix', false),
      inputRef,
      state,
      model,
      lazyState,
      colorClasses,
      colorStyles,
    };
  },
  render() {
    return h(
      'div',
      mergeProps(
        {
          class: {
            'text-input__wrapper': true,
            'text-input--flat': this.flat,
            'text-input--small': this.small,
            'text-input--large': this.large,
            'text-input--focusing': this.state.isFocusing,
          },
        },
        {
          class: this.colorClasses,
          style: this.colorStyles,
        }
      ),
      [
        this.$slots.prefix && this.genInputPrefix(this.$slots.prefix()),
        this.genInput(),
        this.$slots.suffix && this.genInputSuffix(this.$slots.suffix()),
      ]
    );
  },
});
