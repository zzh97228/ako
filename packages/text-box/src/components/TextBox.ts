import vue, { computed, defineComponent, h, reactive, VNodeArrayChildren } from 'vue';
import { genModelProps, useModel, useFieldConsumer, convertToNumber } from '@lagabu/shared';

export default defineComponent({
  name: 'TextBox',
  props: {
    autofocus: Boolean,
    minlength: [String, Number],
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
  },
  setup(props, context) {
    const state = reactive({
      isComposing: false,
    });
    const notAllowed = computed(() => props.disabled || props.readonly);

    const { model, lazyState, setInnerState } = useModel(props, context, notAllowed);
    useFieldConsumer({
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

    const genTextarea = () => {
      return h('textarea', {
        class: 'text-box',
        placeholder: props.placeholder,
        disabled: props.disabled,
        readonly: props.readonly,
        autofocus: props.autofocus,
        autocomplete: props.autocomplete ? 'on' : 'off',
        spellcheck: props.spellcheck,
        minlength: props.minlength,
        maxlength: props.maxlength,
        rows: props.rows || 10,
        cols: props.cols || 20,
        onInput,
        onCompositionstart: () => {
          state.isComposing = true;
        },
        onCompositionend: () => {
          state.isComposing = false;
        },
      });
    };
    return {
      model,
      lazyState,
      state,
      genTextarea,
    };
  },
  methods: {
    genCountText(count: number) {
      const children: VNodeArrayChildren = [h('span', String(count))];
      if (this.maxlength) {
        children.push(h('span', '/'));
        children.push(h('span', this.maxlength));
      }
      return h(
        'span',
        {
          class: 'text-box__count',
        },
        children
      );
    },
    genCountTextWrapper() {
      if (!this.showCount) return;
      let children: VNodeArrayChildren = [];
      const wordLength = this.lazyState.value?.length || 0;
      if (this.$slots.count) {
        children = [this.$slots.count(wordLength)];
      } else {
        children.push(this.genCountText(wordLength));
      }
      return h(
        'div',
        {
          class: 'text-box__count--wrapper',
        },
        children
      );
    },
    genBoxContent() {
      return h(
        'div',
        {
          class: 'text-box__content',
        },
        [this.genTextarea(), this.genCountTextWrapper()]
      );
    },
  },
  render() {
    return h(
      'div',
      {
        class: {
          'text-box__wrapper': true,
          'text-box--disabled': this.disabled,
        },
      },
      [this.genBoxContent()]
    );
  },
});
