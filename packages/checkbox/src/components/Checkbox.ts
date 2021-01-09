import {
  deepEqual,
  genToggleProps,
  isUndefined,
  useModel,
  useToggle,
  setActive,
  genColorProp,
  useColor,
  ClickOutside,
  useFieldConsumer,
} from '@lagabu/shared';
import vue, { computed, defineComponent, h, isReadonly, onBeforeUnmount, ref, toRef, watch, withDirectives } from 'vue';
import { useGroupConsumer, namespace, useCheckboxGroupConsumer } from '../composables';

export default defineComponent({
  name: 'checkbox',
  props: {
    ...genToggleProps('checkbox--active'),
    ...genColorProp(),
    modelValue: Boolean,
    indetermined: Boolean,
    radio: Boolean,
    switch: Boolean,
    disabled: Boolean,
    toggleable: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, context) {
    const { isActive, toggle } = useToggle(props, context);
    const { class: colorClasses, style: colorStyle } = useColor(props, true);
    const inputRef = ref<null | HTMLInputElement>(null);
    const { lazyState, model, setInnerState } = useModel(
      props,
      context,
      toRef(props, 'disabled'),
      (innerState, newVal, oldVal) => {
        if (deepEqual(newVal, oldVal) || deepEqual(newVal, lazyState.value)) return;
        innerState.value = newVal;
        setActive(isActive, !props.indetermined ? Boolean(newVal) : false);
      }
    );
    // initial checkbox value
    if (isActive.value !== lazyState.value) {
      isReadonly(isActive) ? setInnerState(isActive.value) : (isActive.value = lazyState.value);
    }

    const group = useGroupConsumer(props, isActive);
    const anotherGroup = useCheckboxGroupConsumer();
    let onBlurFunc: (e?: Event) => any | undefined, onFocusFunc: (e?: Event) => any | undefined;

    if (!anotherGroup) {
      const fieldResult = useFieldConsumer({ lazyState, model, setInnerState });
      onBlurFunc = fieldResult.onBlur;
      onFocusFunc = fieldResult.onFocus;
    } else {
      onBlurFunc = anotherGroup.onBlur;
      onFocusFunc = anotherGroup.onFocus;
    }

    function onClick(e: MouseEvent) {
      if (props.disabled) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      toggle(group[namespace] ? group.onToggle : void 0);
    }
    function onPointerdown(e: PointerEvent) {
      if (props.disabled) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      if (inputRef.value) {
        inputRef.value.focus();
      }
    }

    function genInput() {
      let type = 'checkbox';
      if (props.disabled) {
        type = 'disabled';
      } else if (props.radio) {
        type = 'radio';
      } else if (props.switch) {
        type = 'switch';
      }
      return h('input', {
        type,
        ref: inputRef,
        style: {
          display: 'none',
        },
        value: lazyState.value,
        onFocus: (e: Event) => {
          onFocusFunc && onFocusFunc.call(null, e);
        },
        onBlur: (e: Event) => {
          onBlurFunc && onBlurFunc.call(null, e);
        },
      });
    }

    const isActiveStop = watch(isActive, (newVal, oldVal) => {
      if (newVal === oldVal) return;
      model.value = newVal;
    });

    const indeterminedStop = watch(
      () => props.indetermined,
      (newVal, oldVal) => {
        if (newVal) {
          setActive(isActive, void 0);
        }
      }
    );

    const classes = computed(() => {
      return {
        'theme--light': true,
        checkbox: true,
        ...colorClasses.value,
        [`${props.activeClass}`]: isActive.value,
        'checkbox--indetermined': !group[namespace] && props.indetermined && isUndefined(isActive.value),
      };
    });

    const styles = computed(() => {
      return colorStyle.value;
    });

    onBeforeUnmount(() => {
      isActiveStop();
      indeterminedStop();
    });

    return {
      lazyState,
      model,
      classes,
      styles,
      onClick,
      genInput,
      inputRef,
      onPointerdown,
    };
  },
  methods: {
    genCheckbox() {
      return h(
        'div',
        {
          class: this.classes,
          style: this.styles,
        },
        this.genInput()
      );
    },
    genActivator() {
      return h(
        'div',
        {
          class: 'checkbox__activator',
        },
        this.$slots.activator
          ? this.$slots.activator({
              classes: this.classes,
              genInput: this.genInput,
            })
          : this.genCheckbox()
      );
    },
    genLabel() {
      return h(
        'div',
        {
          class: 'checkbox__label',
        },
        this.$slots.default && this.$slots.default()
      );
    },
  },
  render() {
    return withDirectives(
      h(
        'div',
        {
          class: 'checkbox__wrapper',
          onClick: this.onClick,
          onPointerdown: this.onPointerdown,
        },
        [this.genActivator(), this.genLabel()]
      ),
      [[ClickOutside, { callback: () => this.inputRef && this.inputRef.blur() }]]
    );
  },
});
