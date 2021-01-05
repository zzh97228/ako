import {
  computed,
  customRef,
  ExtractPropTypes,
  nextTick,
  onBeforeUnmount,
  reactive,
  SetupContext,
  toRef,
  watch,
} from 'vue';
import { convertToNumber, isNumber, isString } from '../utils/helpers';
import { clamp } from '../utils/math';
import { genModelProps } from './useModel';

export function genPercentProps() {
  return {
    ...genModelProps([String, Number], 0),
    start: {
      type: [String, Number],
      default: 0,
    },
    end: {
      type: [String, Number],
      default: 100,
    },
    disabled: Boolean,
    partition: {
      type: [String, Number],
      default: 100,
    },
  };
}
export type PercentProps = ReturnType<typeof genPercentProps>;
const percentReg = new RegExp(/(\d*\.?\d+)(?:%)/);

function normalizeValue(val: number | string | undefined) {
  let res = 0;
  if (isNumber(val)) {
    res = val;
  } else if (isString(val)) {
    if (val.match(percentReg)) {
      res = convertToNumber(RegExp.$1) / 100;
    } else {
      res = convertToNumber(val);
    }
  }

  return isNaN(res) ? 0 : res;
}

function normalizePercent(num: number) {
  if (num > 1) {
    num = num / 100;
  }
  return clamp(num, 0, 1);
}

function getPercentNumber(val: number, start: number, end: number) {
  const sub = end - start;
  if (sub === 0) return 0;
  return (val - start) / sub;
}

function getValue(percent: number, start: number, end: number) {
  return percent * (end - start) + start;
}

function roundPercent(percent: number, p: number | string | undefined) {
  p = 100 / clamp(parseInt(String(p)) || 100, 1, 100);
  return (Math.round((percent * 100) / p) * p) / 100;
}

export function usePercent(props: ExtractPropTypes<PercentProps>, context: SetupContext) {
  const notAllowed = toRef(props, 'disabled'),
    start = computed(() => normalizeValue(props.start)),
    end = computed(() => normalizeValue(props.end));

  const state = reactive({
    percent: 0,
    innerValue: 0,
  });

  function setAndEmitValue(percent: number, shouldEmit: boolean = true) {
    const value = getValue(percent, start.value, end.value);
    if (state.innerValue !== value) {
      state.innerValue = value;
      shouldEmit && context.emit('update:modelValue', state.innerValue);
    }
  }

  const model = customRef(() => {
    return {
      get() {
        return state.innerValue;
      },
      set(value: string | number | undefined) {
        if (notAllowed.value || value === state.innerValue) return;
        state.percent = getComputedPercent(value);
        setAndEmitValue(state.percent);
      },
    };
  });

  const percentModel = customRef<number>(() => {
    return {
      get(): number {
        return state.percent;
      },
      set(value: number | string | undefined) {
        if (notAllowed.value || value === state.percent) return;
        let tempNum = 0;
        if (isNumber(value)) {
          tempNum = normalizePercent(value);
        } else if (isString(value)) {
          if (value.match(percentReg)) {
            tempNum = convertToNumber(RegExp.$1) / 100;
          } else {
            tempNum = convertToNumber(value);
          }
          tempNum = normalizePercent(tempNum);
        }

        state.percent = roundPercent(tempNum, props.partition);
        setAndEmitValue(state.percent);
      },
    };
  });

  const stopWatchModelValue = watch(
    () => props.modelValue,
    (newVal, oldVal) => {
      if (notAllowed.value || newVal === oldVal || newVal == state.innerValue) return;
      nextTick(() => {
        state.percent = getComputedPercent(newVal);
        state.innerValue = getValue(state.percent, start.value, end.value);
      });
    }
  );

  function getComputedPercent(val: string | number | undefined): number {
    let percentNumber = 0;
    const sVal = start.value,
      eVal = end.value;
    if (isNumber(val)) {
      percentNumber = getPercentNumber(val, sVal, eVal);
    } else if (isString(val)) {
      if (val.match(percentReg)) {
        percentNumber = convertToNumber(RegExp.$1) / 100;
      } else {
        percentNumber = getPercentNumber(convertToNumber(val), sVal, eVal);
      }
    }
    return roundPercent(clamp(percentNumber, 0, 1), props.partition);
  }

  // initial percent number and lazyState.value
  state.percent = getComputedPercent(props.modelValue);
  setAndEmitValue(state.percent, false);

  onBeforeUnmount(() => {
    stopWatchModelValue();
  });
  return {
    start,
    end,
    model,
    percent: percentModel,
  };
}
