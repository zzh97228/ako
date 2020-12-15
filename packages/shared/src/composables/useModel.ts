import vue, {
  computed,
  customRef,
  DeepReadonly,
  isRef,
  onBeforeUnmount,
  reactive,
  readonly,
  Ref,
  SetupContext,
  UnwrapRef,
  watch,
  WatchStopHandle,
} from 'vue';
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
type InnerState<T> = {
  value: T | undefined;
};
type LazyStateType<T> = {
  readonly value: DeepReadonly<UnwrapRef<T>> | undefined;
};
type ModelCallback<T> = (innerState: InnerState<T>, newVal: TOrUndefined<T>, oldVal: TOrUndefined<T>) => any;
export type ModelReturn<T extends unknown> = {
  lazyState: LazyStateType<T>;
  model: Ref<T | undefined>;
  setInnerState: (val: T | undefined | UnwrapRef<T>) => void;
};

export function useModel<T extends unknown>(
  props: ModelPropType<T>,
  context: SetupContext,
  disabled?: boolean | Ref<boolean>,
  modelCb?: ModelCallback<T>,
  beforeUnmountCb?: (...args: any) => any
) {
  const innerState = reactive({
    value: props.modelValue,
  }) as InnerState<T>;
  const lazyState: LazyStateType<T> = readonly(innerState);
  const notAllowed = computed(() => (isRef(disabled) ? disabled.value : !!disabled));
  const setInnerState = (val: T | undefined | UnwrapRef<T>) => {
    if (notAllowed.value) return;
    innerState.value = val as T;
  };

  const model = customRef<T | undefined>(() => {
    return {
      get() {
        return innerState.value;
      },
      set(val) {
        if (notAllowed.value || deepEqual(val, lazyState.value)) return;
        innerState.value = val;
        context.emit('update:modelValue', val);
      },
    };
  });

  const stopWatcher: WatchStopHandle = watch(
    () => props.modelValue,
    (newVal, oldVal) => {
      if (notAllowed.value) return;
      if (!modelCb) {
        if (deepEqual(newVal, oldVal) || deepEqual(newVal, lazyState.value)) return;
        innerState.value = newVal as T | undefined;
      } else {
        modelCb.call(null, innerState, newVal, oldVal);
      }
    }
  );

  onBeforeUnmount(() => {
    if (beforeUnmountCb) {
      beforeUnmountCb.call(null);
    } else {
      stopWatcher();
    }
  });

  return {
    lazyState,
    model,
    setInnerState,
    stopWatcher,
  };
}
