import { inject, InjectionKey, onBeforeUnmount, provide, watch, WatchStopHandle } from 'vue';
import { deepEqual, isUndefined } from '../utils/helpers';
import { ModelReturn } from './useModel';
export const FieldSymbol: InjectionKey<{
  inField: boolean;
  register: (instance: FieldContent) => any;
  unregister: (instance: FieldContent) => any;
}> = Symbol('Field');

let fieldUID = 0;
export const enum FieldEnum {
  parent = 1,
  child = 1 << 1,
}
export type FieldContentOptions<T> = { [props: string]: any } & ModelReturn<T>;
export class FieldContent<T = any> {
  fieldUID: number;
  lazyState: ModelReturn<T>['lazyState'];
  model: ModelReturn<T>['model'];
  setInnerState: ModelReturn<T>['setInnerState'];

  type: FieldEnum;
  childStop?: WatchStopHandle;
  currentStop?: WatchStopHandle;
  constructor(opts: FieldContentOptions<T>, type: FieldEnum = FieldEnum.child) {
    this.type = type;
    this.fieldUID = fieldUID++;
    this.model = opts.model;
    this.lazyState = opts.lazyState;
    this.setInnerState = opts.setInnerState;
  }

  bindChild(child: FieldContent<T>) {
    if (this.type !== FieldEnum.parent && child.type !== FieldEnum.child) return;
    // set init value
    if (!isUndefined(this.lazyState.value)) {
      child.setInnerState.call(null, this.lazyState.value as T);
    } else if (!isUndefined(child.lazyState.value)) {
      this.setInnerState.call(null, child.lazyState.value as T);
    }

    // watch child's model and emit model
    this.childStop = watch(child.model, (newVal, oldVal) => {
      if (deepEqual(newVal, oldVal) || deepEqual(this.lazyState.value, newVal)) return;
      this.model.value = newVal;
    });
    // watch current lazyState input and change child's input
    this.currentStop = watch(
      () => this.lazyState.value,
      (newVal, oldVal) => {
        if (deepEqual(newVal, oldVal) || deepEqual(child.lazyState.value, newVal)) return;
        child.setInnerState.call(null, newVal as T);
      }
    );
  }

  unregister() {
    this.childStop && this.childStop();
    this.currentStop && this.currentStop();
  }
}

export function useFieldProvider<T extends unknown>(modelOptions: ModelReturn<T>) {
  const parent = new FieldContent(modelOptions, FieldEnum.parent);
  function register(child: FieldContent) {
    parent.bindChild(child);
  }
  function unregister(child: FieldContent) {
    parent.unregister();
    child.unregister();
  }
  provide(FieldSymbol, {
    register,
    unregister,
    inField: true,
  });

  return {};
}
export function useFieldConsumer<T extends unknown>(modelOptions: ModelReturn<T>) {
  const content = new FieldContent(modelOptions);
  const field = inject(FieldSymbol, {
    inField: false,
    register: (...args: any[]) => {},
    unregister: (...args: any[]) => {},
  });
  if (field.inField) {
    field.register(content);

    onBeforeUnmount(() => {
      field.unregister(content);
    });
  }
}