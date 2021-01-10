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
import vue, {
  computed,
  defineComponent,
  h,
  isReadonly,
  onBeforeUnmount,
  ref,
  toRef,
  VNodeArrayChildren,
  watch,
  withDirectives,
} from 'vue';
import { useGroupConsumer, namespace, useCheckboxGroupConsumer } from '../composables';

export default defineComponent({
  name: 'checkbox',
  props: {
    ...genToggleProps('checkbox--active'),
    ...genColorProp('primary'),
    modelValue: {
      type: Boolean,
      default: void 0,
    },
    indetermined: Boolean,
    radio: Boolean,
    switch: Boolean,
    tile: Boolean,
    disabled: Boolean,
    toggleable: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, context) {
    const { isActive, toggle } = useToggle(props, context);
    const hasFocus = ref(false);
    const { class: colorClasses, style: colorStyle } = useColor(props, true);
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

    if (!anotherGroup.inGroup) {
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
      if (props.radio && !props.indetermined && isActive.value) {
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
      onFocusFunc && onFocusFunc.call(null, e);
      hasFocus.value = true;
    }
    function onClickOutside(e?: Event) {
      if (props.disabled) {
        e && e.preventDefault();
        e && e.stopImmediatePropagation();
        return;
      }
      onBlurFunc && onBlurFunc.call(null, e);
      hasFocus.value = false;
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
        'checkbox--tile': props.tile,
        'checkbox--switch': props.switch,
        'checkbox--radio': props.radio,
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
      onPointerdown,
      hasFocus,
      onClickOutside,
    };
  },
  methods: {
    genCheckbox() {
      return h('div', {
        class: this.classes,
        style: this.styles,
      });
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
            })
          : this.genCheckbox()
      );
    },
    genLabel(children?: VNodeArrayChildren) {
      return h(
        'div',
        {
          class: 'checkbox__label',
        },
        children
      );
    },
  },
  render() {
    return withDirectives(
      h(
        'div',
        {
          class: {
            checkbox__wrapper: true,
            'checkbox--focusing': this.hasFocus,
            'checkbox--disabled': this.disabled,
          },
          onClick: this.onClick,
          onPointerdown: this.onPointerdown,
        },
        [this.genActivator(), this.$slots.default && this.genLabel(this.$slots.default())]
      ),
      [
        [
          ClickOutside,
          {
            callback: this.onClickOutside,
          },
        ],
      ]
    );
  },
});
