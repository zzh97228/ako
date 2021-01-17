import vue, {
  inject,
  InjectionKey,
  onBeforeUnmount,
  onMounted,
  provide,
  reactive,
  readonly,
  ref,
  Ref,
  toRef,
  watch,
  watchEffect,
  WatchStopHandle,
} from 'vue';
import { deepEqual, isUndefined } from '../utils/helpers';
import { ModelReturn } from './useModel';

interface ConsumerState {
  hasFocus: boolean;
  isFocusing: boolean;
}
interface RegisterReturn {
  hasError: Ref<boolean>;
}
export const FieldSymbol: InjectionKey<{
  inField: boolean;
  register: (childModel: ModelReturn<any>, uid: number, childState: ConsumerState) => RegisterReturn;
  unregister: (uid: number) => any;
}> = Symbol('Field');

export function useFieldProvider<T extends unknown>(modelOptions: ModelReturn<T>) {
  const { lazyState, setInnerState, model } = modelOptions;
  const fieldState = reactive({
    isFocusing: false,
    hasFocus: false,
    hasError: false,
  });
  let currentStop: WatchStopHandle | undefined,
    consumerStateStop: WatchStopHandle | undefined,
    childStop: WatchStopHandle | undefined,
    bindHasErrorStop: WatchStopHandle | undefined,
    _uid = -1;
  function register(child: ModelReturn<any>, uid: number, childState: ConsumerState) {
    _uid = uid;
    if (!isUndefined(lazyState.value)) {
      child.setInnerState.call(null, lazyState.value as T);
    } else if (!isUndefined(child.lazyState.value)) {
      setInnerState.call(null, lazyState.value as T);
    }

    // watch child's model and emit model
    childStop = watch(child.model, (newVal, oldVal) => {
      if (deepEqual(newVal, oldVal) || deepEqual(lazyState.value, newVal)) return;
      model.value = newVal;
    });
    // watch current lazyState input and change child's input
    currentStop = watch(
      () => lazyState.value,
      (newVal, oldVal) => {
        if (deepEqual(newVal, oldVal) || deepEqual(child.lazyState.value, newVal)) return;
        child.setInnerState.call(null, newVal as T);
      }
    );

    // bind child state
    consumerStateStop = watchEffect(() => {
      fieldState.isFocusing = childState.isFocusing;
      fieldState.hasFocus = childState.hasFocus;
    });

    return {
      hasError: readonly(toRef(fieldState, 'hasError')),
    };
  }

  function bindHasError(hasError: Ref<boolean>) {
    bindHasErrorStop = watch(hasError, (newVal, oldVal) => {
      if (newVal === oldVal) return;
      console.log(newVal);
      fieldState.hasError = Boolean(newVal);
    });
  }

  function unregister(uid: number) {
    if (_uid !== uid) return;
    currentStop && currentStop();
    childStop && childStop();
    consumerStateStop && consumerStateStop();
    bindHasErrorStop && bindHasErrorStop();
  }

  provide(FieldSymbol, {
    register,
    unregister,
    inField: true,
  });

  onBeforeUnmount(() => {
    unregister(_uid);
  });

  return {
    isFocusing: readonly(toRef(fieldState, 'isFocusing')),
    hasFocus: readonly(toRef(fieldState, 'hasFocus')),
    bindHasError,
  };
}
let fieldConsumerUID = 0;
export function useFieldConsumer<T extends unknown>(modelOptions: ModelReturn<T>) {
  const field = inject(FieldSymbol, {
    inField: false,
    register: (...args: any[]) => ({ hasError: ref(false) }),
    unregister: (...args: any[]) => {},
  });
  const state = reactive({
    hasFocus: false,
    isFocusing: false,
  });
  const uid = fieldConsumerUID++;
  const { hasError } = field.register(modelOptions, uid, state);

  onBeforeUnmount(() => {
    field.unregister(uid);
  });

  function onFocus(e?: Event) {
    state.hasFocus = true;
    state.isFocusing = true;
  }
  function onBlur(e?: Event) {
    state.isFocusing = false;
  }

  onMounted(() => {
    state.hasFocus = false;
    state.isFocusing = false;
  });

  return {
    onBlur,
    onFocus,
    hasError,
    state,
  };
}
