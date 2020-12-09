import vue, { defineComponent, h, reactive, ref, VNodeArrayChildren } from 'vue';
import { useModel, genModelProps } from '@lagabu/shared';

function createAddonSlot(className: string) {
  return (children?: VNodeArrayChildren) =>
    h(
      'div',
      {
        class: className,
      },
      children
    );
}

export default defineComponent({
  name: 'text-input',
  props: {
    disabled: Boolean,
    ...genModelProps([String, Number]),
  },
  setup(props, context) {
    const { emit } = context;
    const { model, lazyState } = useModel(props, context);
    const inputRef = ref<null | HTMLInputElement>(null);
    const state = reactive({
      isComposing: false,
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
        onCompositionstart: () => {
          state.isComposing = true;
        },
        onCompositionend: () => {
          state.isComposing = false;
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

    return {
      genInput,
      genInputPrefix: createAddonSlot('text-input__prefix'),
      genInputSuffix: createAddonSlot('text-input__suffix'),
      inputRef,
      state,
      model,
      lazyState,
    };
  },
  render() {
    return h(
      'div',
      {
        class: 'text-input__wrapper',
      },
      [
        this.$slots.prefix && this.genInputPrefix(this.$slots.prefix()),
        this.genInput(),
        this.$slots.suffix && this.genInputSuffix(this.$slots.suffix()),
      ]
    );
  },
});
