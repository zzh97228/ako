import { computed, ExtractPropTypes, isReadonly, isRef, readonly, ref, Ref, SetupContext, toRef } from 'vue';
import { isBool, isFunction, isUndefined } from '../utils/helpers';

export function genToggleProps(defaultClass?: string) {
  return {
    activeClass: {
      type: String,
      default: defaultClass || void 0,
    },
    active: {
      type: Boolean,
      default: void 0,
    },
    toggleable: Boolean,
  };
}
export function setActive(isActive: Ref<boolean | undefined>, value: any, cb?: () => any) {
  if (isReadonly(isActive)) return;
  isActive.value = value;
  cb && isFunction(cb) && cb.call(null);
}

export type TogglePropsType = ExtractPropTypes<ReturnType<typeof genToggleProps>>;
export function useToggle(props: TogglePropsType, ctx: SetupContext) {
  const isActive: Ref<boolean | undefined> = isUndefined(props.active) ? ref(false) : readonly(toRef(props, 'active'));
  return {
    class: computed(() => {
      if (!props.activeClass) return {};
      return {
        [`${props.activeClass}`]: isActive.value,
      };
    }),
    toggle: (cb?: () => any, notAllowed?: boolean | Ref<boolean>) => {
      if (!props.toggleable || (isRef(notAllowed) && notAllowed.value) || (isBool(notAllowed) && notAllowed)) return;
      setActive(isActive, !isActive.value, () => {
        cb && isFunction(cb) && cb.call(null);
        ctx.emit('update:active', isActive.value);
      });
    },
    isActive,
  };
}

export type ToggleReturn = Omit<ReturnType<typeof useToggle>, 'class'>;
