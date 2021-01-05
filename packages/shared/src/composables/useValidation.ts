import { ExtractPropTypes, nextTick, onBeforeUnmount, PropType, reactive, ref, SetupContext, watch } from 'vue';
import { deepEqual } from '../utils/helpers';
import { ModelReturn } from './useModel';

export function genValidationProps() {
  return {
    rules: {
      type: Array as PropType<Array<(v?: any) => string | boolean | undefined>>,
      default: () => [],
    },
    validateImmediate: Boolean,
  };
}
type ValidationProps = ExtractPropTypes<ReturnType<typeof genValidationProps>>;
export function useValidation<T extends any>(
  props: ValidationProps,
  context: SetupContext,
  lazyState: ModelReturn<T>['lazyState']
) {
  const hasError = ref(false);
  const errors: Array<{
    index: number;
    error: any;
  }> = reactive([]);

  function clearErrors() {
    errors.splice(0, errors.length);
  }

  function validate(val: any) {
    const rules = props.rules;
    clearErrors();
    let child: string | boolean | undefined;
    for (let i = 0; i < rules.length; i++) {
      if ((child = rules[i].call(null, val))) {
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

  const stopHandler = watch([() => lazyState.value, () => props.rules], (newVals, oldVals) => {
    const newState = newVals[0],
      newRules = newVals[1];
    const oldState = oldVals ? oldVals[0] : void 0,
      oldRules = oldVals ? oldVals[1] : void 0;
    if (!deepEqual(newState, oldState) || !deepEqual(newRules, oldRules)) {
      validate(newState);
    }
  });

  nextTick(() => {
    if (props.validateImmediate) {
      validate(lazyState.value);
    }
  });

  onBeforeUnmount(() => {
    stopHandler();
  });

  return {
    errors,
    hasError,
  };
}
