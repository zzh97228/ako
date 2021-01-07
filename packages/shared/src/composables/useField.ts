import { inject, InjectionKey, onBeforeUnmount, provide, watch, WatchStopHandle } from 'vue';
import { deepEqual, isUndefined } from '../utils/helpers';
import { ModelReturn } from './useModel';
export const FieldSymbol: InjectionKey<{
  inField: boolean;
  register: (childModel: ModelReturn<any>, uid: number) => any;
  unregister: (uid: number) => any;
}> = Symbol('Field');

export function useFieldProvider<T extends unknown>(modelOptions: ModelReturn<T>) {
  const { lazyState, setInnerState, model } = modelOptions;
  let currentStop: WatchStopHandle,
    childStop: WatchStopHandle,
    _uid = -1;
  function register(child: ModelReturn<any>, uid: number) {
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
  }
  function unregister(uid: number) {
    if (_uid !== uid) return;
    currentStop && currentStop();
    childStop && childStop();
  }
  provide(FieldSymbol, {
    register,
    unregister,
    inField: true,
  });

  return {};
}
let fieldConsumerUID = 0;
export function useFieldConsumer<T extends unknown>(modelOptions: ModelReturn<T>) {
  const field = inject(FieldSymbol, {
    inField: false,
    register: (...args: any[]) => {},
    unregister: (...args: any[]) => {},
  });
  if (field.inField) {
    const uid = fieldConsumerUID++;
    field.register(modelOptions, uid);

    onBeforeUnmount(() => {
      field.unregister(uid);
    });
  }
}
