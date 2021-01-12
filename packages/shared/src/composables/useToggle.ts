import {
  computed,
  customRef,
  ExtractPropTypes,
  isReadonly,
  isRef,
  nextTick,
  onBeforeUnmount,
  reactive,
  readonly,
  ref,
  Ref,
  SetupContext,
  toRef,
  watch,
} from 'vue';
import { isBool, isFunction, isUndefined } from '../utils/helpers';

export function genToggleProps(defaultClass?: string, toggleable?: boolean) {
  return {
    activeClass: {
      type: String,
      default: defaultClass || void 0,
    },
    active: {
      type: Boolean,
      default: void 0,
    },
    toggleable: {
      type: Boolean,
      default: toggleable,
    },
  };
}
export function setActive(isActive: Ref<boolean | undefined>, value: any, cb?: () => any) {
  if (isReadonly(isActive)) return;
  isActive.value = value;
  cb && isFunction(cb) && cb.call(null);
}

export type TogglePropsType = ExtractPropTypes<ReturnType<typeof genToggleProps>>;
export function useToggle(props: TogglePropsType, ctx: SetupContext, disabled?: boolean | Ref<boolean>) {
  const state = reactive({
    innerActive: props.active as boolean | undefined,
    shouldCustomize: isUndefined(props.active),
  });
  const globalNotAllowed = computed(() => {
    if (isUndefined(disabled) || isBool(disabled)) return Boolean(disabled);
    return disabled.value;
  });
  const isActive = customRef<boolean | undefined>(() => {
    return {
      get() {
        return state.innerActive;
      },
      set(val: any) {
        if (globalNotAllowed.value || !state.shouldCustomize || !(isBool(val) || isUndefined(val))) {
          return;
        }
        state.innerActive = val;
      },
    };
  });

  const stopActive = watch(
    () => props.active,
    (newVal, oldVal) => {
      if (globalNotAllowed.value || newVal === oldVal) {
        return;
      }
      if (isUndefined(newVal)) {
        state.shouldCustomize = true;
        return;
      }

      state.shouldCustomize = false;
      state.innerActive = newVal;
    }
  );
  onBeforeUnmount(() => {
    stopActive();
  });
  return {
    class: computed(() => {
      if (!props.activeClass) return {};
      return {
        [`${props.activeClass}`]: isActive.value,
      };
    }),
    toggle: (cb?: () => any, notAllowed?: boolean | Ref<boolean>) => {
      if (
        !props.toggleable ||
        globalNotAllowed.value ||
        (isRef(notAllowed) && notAllowed.value) ||
        (isBool(notAllowed) && notAllowed)
      ) {
        return;
      }
      isActive.value = !isActive.value;
      cb && isFunction(cb) && cb.call(null);
      ctx.emit('update:active', isActive.value);
    },
    isActive,
  };
}

export type ToggleReturn = Omit<ReturnType<typeof useToggle>, 'class'>;
