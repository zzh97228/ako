import vue, { computed, ComputedRef, defineComponent, h, reactive, VNodeArrayChildren } from 'vue';
import { genModelProps, useModel, useFieldConsumer, genColorProp, useColor, sizeProps, useSize } from '@lagabu/shared';

export default defineComponent({
  name: 'TextBox',
  props: {
    autofocus: Boolean,
    maxlength: [String, Number],
    showCount: Boolean,
    disabled: Boolean,
    readonly: Boolean,
    placeholder: String,
    autocomplete: Boolean,
    spellcheck: [Boolean, String],
    rows: [String, Number],
    cols: [String, Number],
    ...genModelProps(String),
    ...genColorProp('primary'),
    ...sizeProps,
  },
  setup(props, context) {
    const state = reactive({
      isComposing: false,
    });
    const notAllowed = computed(() => props.disabled || props.readonly);
    const { class: colorClasses, style: colorStyles } = useColor(props, true);
    const { sizeStyle } = useSize(props);
    const { model, lazyState, setInnerState } = useModel(props, notAllowed);
    const { onBlur, onFocus } = useFieldConsumer({
      model,
      lazyState,
      setInnerState,
    });

    const onInput = (e: InputEvent) => {
      if (notAllowed.value || state.isComposing) {
        e.stopImmediatePropagation();
        return;
      }
      const target = e.target as HTMLTextAreaElement;
      model.value = target.value;
      context.emit('input', lazyState.value);
    };

    const computedWordCount: ComputedRef<string> = computed(() => {
      if (!props.showCount) return '';
      const l = lazyState.value?.length || 0;
      return '' + l + (props.maxlength ? ` / ${props.maxlength}` : '');
    });

    function genTextarea() {
      return h('textarea', {
        class: {
          'text-box': true,
          ...colorClasses.value,
        },
        style: {
          ...colorStyles.value,
        },
        placeholder: props.placeholder,
        disabled: props.disabled,
        readonly: props.readonly,
        autofocus: props.autofocus,
        autocomplete: props.autocomplete ? 'on' : 'off',
        spellcheck: props.spellcheck,
        maxlength: props.maxlength,
        rows: props.rows || 10,
        cols: props.cols || 20,
        onInput,
        onFocus,
        onBlur,
        onCompositionstart: () => {
          state.isComposing = true;
        },
        onCompositionend: () => {
          state.isComposing = false;
        },
      });
    }

    return {
      model,
      lazyState,
      sizeStyle,
      genTextarea,
      computedWordCount,
    };
  },
  render() {
    return h(
      'div',
      {
        class: {
          'text-box__wrapper': true,
          'text-box--disabled': this.disabled,
        },
        style: this.sizeStyle,
        ['data-text-count']: this.computedWordCount,
      },
      this.genTextarea()
    );
  },
});
