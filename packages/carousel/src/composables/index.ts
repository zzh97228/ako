import { convertToNumber, deepEqual, isNumber, isString, useModel } from '@lagabu/shared';
import { inject, InjectionKey, onBeforeUnmount, provide, Ref, ref, SetupContext, toRef } from 'vue';

export const CarouselSymbol: InjectionKey<{
  register: (...args: any[]) => any;
  unregister: (...args: any[]) => any;
}> = Symbol('Carousel');

function normalizeValue(str: any): number {
  let num: string | number = str;
  if (isNumber(num)) {
    return num;
  } else if (isString(str) && (num = convertToNumber(str))) {
    return num;
  }
  return 0;
}

export function useCarouselProvider(
  props: Readonly<{} & { modelValue: number | string; disabled: boolean }>,
  context: SetupContext
) {
  const {} = useModel(props, context, toRef(props, 'disabled'), (innerState, newVal, oldVal) => {
    newVal = normalizeValue(newVal);
    if (deepEqual(newVal, oldVal) || deepEqual(newVal, innerState.value)) return;
    innerState.value = newVal;
    // TODO click prev or next
  });
  const items: Array<{
    isActive: Ref<boolean>;
    uid: number;
  }> = [];

  function register(isActive: Ref<boolean>, uid: number) {
    items.push({
      isActive,
      uid,
    });
  }

  function unregister(uid: number) {
    const idx = items.findIndex((item) => item.uid === uid);
    if (idx >= 0) {
      items.splice(idx, 1);
    }
  }

  function clickNext() {}

  function clickPrev() {}

  provide(CarouselSymbol, {
    register,
    unregister,
  });

  return {
    clickNext,
    clickPrev,
  };
}
let _cuid = 0;
export function useCarouselConsumer() {
  const isActive = ref(false);
  const _id = _cuid++;
  const provider = inject(CarouselSymbol, {
    register: function (...args: any[]) {},
    unregister: function (...args: any[]) {},
  });

  provider.register(isActive, _id);

  onBeforeUnmount(() => {
    provider.unregister(_id);
  });
}
