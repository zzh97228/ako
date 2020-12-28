import { deepEqual, genToggleProps, isUndefined, useModel, useToggle } from '@lagabu/shared';
import vue, { computed, defineComponent, h, isReadonly, mergeProps, onBeforeUnmount, toRef, watch } from 'vue';
import { useGroupConsumer, namespace } from '../composables';
export default defineComponent({
  name: 'checkbox',
  props: {
    ...genToggleProps('checkbox--active'),
    modelValue: Boolean,
    indetermined: Boolean,
    radio: Boolean,
    disabled: Boolean,
    toggleable: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, context) {
    const { isActive, toggle } = useToggle(props, context);
    const { lazyState, model, setInnerState } = useModel(
      props,
      context,
      toRef(props, 'disabled'),
      (innerState, newVal, oldVal) => {
        if (deepEqual(newVal, oldVal) || deepEqual(newVal, lazyState.value)) return;
        innerState.value = newVal;
        if (!isReadonly(isActive)) {
          isActive.value = !props.indetermined ? Boolean(newVal) : false;
        }
      }
    );
    // initial checkbox value
    if (isActive.value !== lazyState.value) {
      isReadonly(isActive) ? setInnerState(isActive.value) : (isActive.value = lazyState.value);
    }

    const group = useGroupConsumer(props, isActive);
    function onClick(e: MouseEvent) {
      if (props.disabled) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      toggle(group[namespace] ? group.onToggle : void 0);
    }

    const isActiveStop = watch(isActive, (newVal, oldVal) => {
      if (newVal === oldVal) return;
      model.value = newVal;
    });

    const indeterminedStop = watch(
      () => props.indetermined,
      (newVal, oldVal) => {
        if (newVal) {
          isActive.value = void 0 as any;
        }
      }
    );

    const classes = computed(() => {
      return {
        checkbox: true,
        [`${props.activeClass}`]: isActive.value,
        'checkbox--indetermined': !group[namespace] && props.indetermined && isUndefined(isActive.value),
      };
    });

    onBeforeUnmount(() => {
      isActiveStop();
      indeterminedStop();
    });

    return {
      lazyState,
      model,
      classes,
      onClick,
    };
  },
  methods: {
    genCheckbox() {
      return h('div', {
        class: this.classes,
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
    return h(
      'div',
      {
        class: 'checkbox__wrapper',
        onClick: this.onClick,
      },
      [this.genActivator(), this.genLabel()]
    );
  },
});
