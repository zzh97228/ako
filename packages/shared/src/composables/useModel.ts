import vue, { customRef, reactive, Ref, SetupContext, UnwrapRef, watch } from 'vue';
import { deepEqual } from '../utils/helpers';

export type ModelPropType<T> = { [prop: string]: any } & {
  modelValue?: T | undefined;
};

type TempConstructor<T = any> =
  | {
      new (...args: any[]): T & object;
    }
  | { (): T };
export function genModelProps<T extends TempConstructor | Array<TempConstructor>, U extends unknown>(
  type: T,
  defaultValue?: U
) {
  return {
    modelValue: {
      type: type,
      default: defaultValue,
    },
  };
}
type TOrUndefined<T = any> = T | undefined;
type LazyStateType<T> = UnwrapRef<{
  value: TOrUndefined<T>;
}>;
type ModelCallback<T> = (lazyState: LazyStateType<T>, newVal: TOrUndefined<T>, oldVal: TOrUndefined<T>) => any;
export type ModelReturn<T> = {
  lazyState: LazyStateType<T>;
  model: Ref<UnwrapRef<T> | undefined>;
};
/**
 * @public
 * bind v-model and solve pernal model value
 * @param props
 * @param context
 * @param callback
 */
export function useModel<T extends unknown>(
  props: ModelPropType<T>,
  context: SetupContext,
  callback?: ModelCallback<T>
): ModelReturn<T> {
  const lazyState: LazyStateType<T> = reactive({
    value: props.modelValue,
  });
  const model = customRef<UnwrapRef<T> | undefined>(() => {
    return {
      get() {
        return lazyState.value;
      },
      set(val) {
        if (deepEqual(val, lazyState.value)) return;
        lazyState.value = val;
        context.emit('update:modelValue', val);
      },
    };
  });

  watch(
    () => props.modelValue,
    (newVal, oldVal) => {
      if (!callback) {
        if (deepEqual(newVal, oldVal) || deepEqual(newVal, lazyState.value)) return;
        lazyState.value = newVal as UnwrapRef<T> | undefined;
      } else {
        callback.call(null, lazyState, newVal, oldVal);
      }
    }
  );
  return {
    lazyState,
    model,
  };
}
