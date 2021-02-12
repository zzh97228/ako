import {
  clamp,
  convertToNumber,
  convertToUnit,
  deepEqual,
  isBool,
  isNumber,
  isString,
  useModel,
  setActive,
} from '@lagabu/shared';
import vue, {
  ExtractPropTypes,
  inject,
  InjectionKey,
  onBeforeUnmount,
  onMounted,
  provide,
  Ref,
  ref,
  SetupContext,
  toRef,
} from 'vue';
/**
 * @public
 */
export const CarouselSymbol: InjectionKey<{
  register: (...args: any[]) => any;
  unregister: (...args: any[]) => any;
  setParentHeight: (val: number | string | null) => any;
  disabled: Ref<boolean>;
  transitionName: Ref<string>;
  transitionCount: Ref<number>;
  inCarousel: boolean;
}> = Symbol('Carousel');
const defaultTimeout = 3000;
/**
 * @public
 */
export const carouselProps = {
  modelValue: [String, Number],
  disabled: Boolean,
  loop: Boolean,
  auto: [Boolean, String, Number],
};

function normalizeValue(str: any): number {
  let num: string | number = str;
  if (isNumber(num)) {
    return num;
  } else if (isString(str) && !isNaN((num = convertToNumber(str)))) {
    return num;
  }
  return 0;
}

function isValidIndex(idx: number, itemsLength: number) {
  return idx >= 0 && idx < itemsLength;
}
/**
 * @public carousel provider
 * @param props - carousel props
 */
export function useCarouselProvider(props: ExtractPropTypes<typeof carouselProps>) {
  const notAllowed = toRef(props, 'disabled');
  const transitionNextName = 'carousel-transition',
    transitionPrevName = 'carousel-transition--reverse',
    transitionName = ref(transitionNextName);
  const transitionHeight: Ref<string | null> = ref(null),
    transitionCount = ref(0);
  let timerId: any = 0;

  const items: Array<{
    isActive: Ref<boolean>;
    uid: number;
  }> = [];

  function setLoopValue(val: number) {
    if (props.loop) {
      val = val % items.length;
      val < 0 && (val += items.length);
    }
    return val;
  }

  const { model, lazyState, setInnerState } = useModel(props, notAllowed, (innerState, newVal, oldVal) => {
    newVal = normalizeValue(newVal);
    newVal = clamp(setLoopValue(newVal), 0, clamp(items.length - 1, 0));
    if (deepEqual(newVal, oldVal) || deepEqual(newVal, innerState.value) || props.disabled) return;
    innerState.value = newVal;
    transitionName.value = newVal > Number(oldVal) ? transitionNextName : transitionPrevName;
    updateItems(newVal);
  });

  function updateItems(activeIdx: number) {
    if (props.disabled) return;
    for (let i = 0; i < items.length; i++) {
      setActive(items[i].isActive, i === activeIdx);
    }
  }

  function register(isActive: Ref<boolean>, uid: number) {
    const idx =
      items.push({
        isActive,
        uid,
      }) - 1;
    setActive(items[idx].isActive, idx === lazyState.value);
  }

  function unregister(uid: number) {
    const idx = items.findIndex((item) => item.uid === uid);
    if (idx >= 0) {
      items.splice(idx, 1);
    }
  }

  function click(next?: boolean) {
    if (props.disabled) return;
    transitionName.value = next ? transitionNextName : transitionPrevName;
    let current = normalizeValue(lazyState.value);
    current = current + (next ? 1 : -1);
    current = clamp(setLoopValue(current), 0, clamp(items.length - 1, 0));
    updateItems(current);
    model.value = current;
  }

  function clickNext(e: Event) {
    if (props.disabled) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
    click(true);
    // reset auto timer;
    setAutoTimer();
  }

  function clickPrev(e: Event) {
    if (props.disabled) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
    click();
    // reset auto timer;
    setAutoTimer();
  }

  function setParentHeight(val: number | string | null) {
    const converted = convertToUnit(val) || null;
    if (converted === transitionHeight.value) return;
    transitionHeight.value = converted;
  }

  // initial lazyState and  active children
  setInnerState(normalizeValue(lazyState.value));
  // reset items when value invalid
  function initialValue() {
    let idx = lazyState.value as number;
    if (isValidIndex(idx, items.length)) return;
    idx = clamp(setLoopValue(idx), 0, clamp(items.length - 1, 0));
    setInnerState(idx);
    updateItems(idx);
  }
  function clearTimerId() {
    if (!timerId) return;
    clearInterval(timerId);
    timerId = 0;
  }

  function setAutoTimer() {
    clearTimerId();
    if (!props.auto) return;
    let timeout = defaultTimeout,
      tempTimeout: number;
    if (!isBool(props.auto) && (tempTimeout = convertToNumber(props.auto))) {
      timeout = tempTimeout;
    }
    timerId = setInterval(() => {
      if (lazyState.value === items.length - 1) {
        return clearTimerId();
      }
      click(true);
    }, timeout);
  }

  onMounted(() => {
    initialValue();
    setAutoTimer();
  });

  onBeforeUnmount(() => {
    clearTimerId();
  });

  provide(CarouselSymbol, {
    register,
    unregister,
    transitionName,
    transitionCount,
    disabled: notAllowed,
    inCarousel: true,
    setParentHeight,
  });

  return {
    clickNext,
    clickPrev,
    click,
    transitionHeight,
  };
}
let _cuid = 0;
/**
 * @public carousel consumer
 * @param isActive - Ref<boolean>
 */
export function useCarouselConsumer(isActive: Ref<boolean | undefined>) {
  const _id = _cuid++;
  const provider = inject(CarouselSymbol, {
    register: function (...args: any[]) {},
    unregister: function (...args: any[]) {},
    disabled: ref(false),
    transitionCount: ref(0),
    transitionName: ref(''),
    inCarousel: false,
    setParentHeight: function (val: number | string | null) {},
  });

  provider.inCarousel && provider.register(isActive, _id);

  onBeforeUnmount(() => {
    provider.inCarousel && provider.unregister(_id);
  });

  return {
    disabled: provider.disabled,
    transitionName: provider.transitionName,
    setParentHeight: provider.setParentHeight,
    transitionCount: provider.transitionCount,
  };
}
