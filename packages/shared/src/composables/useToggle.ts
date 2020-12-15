import { computed, ExtractPropTypes, isReadonly, isRef, readonly, ref, Ref, SetupContext, toRef } from 'vue';
import { isBool, isFunction, isUndefined } from '../utils/helpers';

export function genToggleProps(defaultClass?: string) {
  return {
    activeClass: {
      type: String,
      default: defaultClass || undefined,
    },
    active: {
      type: Boolean,
      default: undefined,
    },
  };
}

export type TogglePropsType = ExtractPropTypes<ReturnType<typeof genToggleProps>>;
export function useToggle(props: TogglePropsType, ctx: SetupContext) {
  const isActive: Ref<boolean> = isUndefined(props.active) ? ref(false) : readonly(toRef(props, 'active'));
  return {
    class: computed(() => {
      if (!props.activeClass) return {};
      return {
        [`${props.activeClass}`]: isActive.value,
      };
    }),
    toggle: (cb?: () => any, notAllowed?: boolean | Ref<boolean>) => {
      if ((isRef(notAllowed) && notAllowed.value) || (isBool(notAllowed) && notAllowed)) return;
      if (!isReadonly(isActive)) {
        isActive.value = !isActive.value;
        cb && isFunction(cb) && cb.call(null);
        ctx.emit('update:active');
      }
    },
    isActive,
  };
}

export type ToggleReturn = Omit<ReturnType<typeof useToggle>, 'class'>;
