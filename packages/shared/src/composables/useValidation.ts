import vue, {
  ExtractPropTypes,
  nextTick,
  onBeforeUnmount,
  PropType,
  reactive,
  Ref,
  ref,
  useContext,
  watch,
  WatchStopHandle,
} from 'vue';
import { deepEqual } from '../utils/helpers';
import { ModelReturn } from './useModel';

export function genValidationProps() {
  return {
    rules: {
      type: Array as PropType<Array<(v?: any) => string | boolean | undefined>>,
      default: () => [],
    },
    validateImmediate: Boolean,
    validateOnBlur: Boolean,
  };
}
type ValidationProps = ExtractPropTypes<ReturnType<typeof genValidationProps>>;
export function useValidation<T extends any>(
  props: ValidationProps,
  lazyState: ModelReturn<T>['lazyState'],
  hasFocus?: Ref<boolean>,
  isFocusing?: Ref<boolean>
) {
  const context = useContext();
  const hasError = ref(false);
  const errors: Array<{
    index: number;
    error: any;
  }> = reactive([]);

  function clearErrors() {
    errors.splice(0, errors.length);
  }

  function validate(val?: any) {
    if (props.validateOnBlur && hasFocus && isFocusing) {
      if (!hasFocus.value || isFocusing.value) return;
    }
    const rules = props.rules;
    const value = val || lazyState.value;
    clearErrors();
    let child: string | boolean | undefined;
    for (let i = 0; i < rules.length; i++) {
      if ((child = rules[i].call(null, value))) {
        errors.push({
          index: i,
          error: child,
        });
      }
    }

    if (errors.length > 0) {
      hasError.value = true;
      context.emit('update:errors', errors);
    } else {
      hasError.value = false;
    }
  }

  const stopWatchStateAndRule = watch([() => lazyState.value, () => props.rules], (newVals, oldVals) => {
    const newState = newVals[0],
      newRules = newVals[1];
    const oldState = oldVals ? oldVals[0] : void 0,
      oldRules = oldVals ? oldVals[1] : void 0;
    if (!deepEqual(newState, oldState) || !deepEqual(newRules, oldRules)) {
      validate(newState);
    }
  });
  // watch isFocusing when validate-on-blur set true
  let stopWatchFocus: WatchStopHandle | undefined;
  if (isFocusing) {
    stopWatchFocus = watch(isFocusing, (newVal, oldVal) => {
      if (!props.validateOnBlur || newVal === oldVal || !hasFocus?.value || newVal) return;
      validate();
    });
  }

  nextTick(() => {
    if (props.validateImmediate) {
      validate();
    }
  });

  onBeforeUnmount(() => {
    stopWatchStateAndRule();
    stopWatchFocus && stopWatchFocus();
  });

  return {
    errors,
    hasError,
    validate,
  };
}
