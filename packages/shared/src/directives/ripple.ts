import { computed, Directive, DirectiveBinding, DirectiveHook, isRef, ref, Ref } from 'vue';
import { convertToNumber, convertToUnit, isBool, isNumber, isObject, isString } from '../utils/helpers';

export type RippleRecord = {
  event?: (...args: any[]) => any;
  eventName?: string;
};
export type RippleBinding = DirectiveBinding<
  | string
  | number
  | {
      disabled?: boolean | Ref<boolean>;
      duration?: string | number;
      eventName?: string;
    }
  | undefined
>;

const mounted: DirectiveHook<HTMLElement> = (el, binding: RippleBinding) => {
  const value = binding.value;
  const arg = binding.arg;

  let disabled: Ref<boolean> = ref(false),
    eventName = 'pointerdown',
    duration = 300,
    tempDur = 0;

  if (isObject(value)) {
    if (isRef(value.disabled)) {
      disabled = value.disabled;
    } else {
      disabled = ref(!!value.disabled);
    }

    if (value.duration && (tempDur = convertToNumber(value.duration))) {
      duration = tempDur;
    }

    if (value.eventName) {
      eventName = value.eventName;
    }
  } else if (value && (tempDur = convertToNumber(value))) {
    duration = tempDur;
  }
  const startTimeout = 250,
    isTile = Boolean(arg && arg === 'tile');

  function setStyles(el: HTMLElement, obj: Record<string, string | null>) {
    for (let key in obj) {
      el.style.setProperty(key, obj[key]);
    }
  }
  function ripple(e: MouseEvent) {
    if (disabled.value) {
      return;
    }
    const rect = el.getBoundingClientRect(),
      elStyle = getComputedStyle(el),
      dx = e.clientX - rect.left,
      dy = e.clientY - rect.top,
      width = el.offsetWidth,
      height = el.offsetHeight,
      maxX = Math.max(dx, width - dx),
      maxY = Math.max(dy, height - dy),
      radius = Math.sqrt(maxX ** 2 + maxY ** 2);
    let elBorderWidth: string | number | null = convertToNumber(getComputedStyle(el).borderWidth);

    // define ripple element
    const rippleWrapper = document.createElement('div');
    rippleWrapper.className = 'ripple__wrapper';
    const rippleContent = document.createElement('div');
    rippleContent.className = 'ripple';

    setStyles(rippleContent, {
      'margin-left': '0',
      'margin-top': '0',
      width: '0',
      height: '0',
      position: 'relative',
      'border-radius': isTile ? '0' : '50%',
      'background-color': 'currentColor',
      opacity: '0.25',
      transition: `all ${duration}ms ease`,
      'z-index': '20',
    });
    elBorderWidth = convertToUnit(0 - elBorderWidth) || null;
    setStyles(rippleWrapper, {
      position: 'absolute',
      top: elBorderWidth,
      left: elBorderWidth,
      bottom: elBorderWidth,
      right: elBorderWidth,
      overflow: 'hidden',
    });

    let storedPosition = el.style.position || getComputedStyle(el).position,
      shouldChangePosition = false;

    if (['absolute', 'fixed'].includes(storedPosition)) {
      el.style.position = 'relative';

      shouldChangePosition = true;
    }

    rippleContent.style.setProperty('margin-left', convertToUnit(dx) || null);
    rippleContent.style.setProperty('margin-top', convertToUnit(dy) || null);

    setStyles(rippleWrapper, {
      'border-top-left-radius': elStyle.borderTopLeftRadius,
      'border-top-right-radius': elStyle.borderTopRightRadius,
      'border-bottom-left-radius': elStyle.borderBottomLeftRadius,
      'border-bottom-right-radius': elStyle.borderBottomRightRadius,
    });

    // append ripple
    rippleWrapper.appendChild(rippleContent);
    el.appendChild(rippleWrapper);

    // start ripple
    setTimeout(() => {
      setStyles(rippleContent, {
        width: convertToUnit(radius * 2) || null,
        height: convertToUnit(radius * 2) || null,
        'margin-left': convertToUnit(dx - radius) || null,
        'margin-top': convertToUnit(dy - radius) || null,
      });
    });

    function clearRipple() {
      setTimeout(() => {
        setStyles(rippleContent, {
          'background-color': 'rgba(0,0,0,0)',
        });
      }, startTimeout);

      // remove ripple__wrapper
      setTimeout(() => {
        rippleWrapper.parentNode?.removeChild(rippleWrapper);
      }, startTimeout + duration);

      // recover parent position
      setTimeout(() => {
        let hasRipple = false;
        for (let i = 0; i < el.children.length; i++) {
          if (el.children[i].className === 'ripple__wrapper') {
            hasRipple = true;
          }
        }
        if (!hasRipple && shouldChangePosition) {
          el.style.setProperty('position', storedPosition);
        }
      }, startTimeout + duration);

      // remove listners
      el.removeEventListener('mouseup', clearRipple, false);
    }
    el.addEventListener('mouseup', clearRipple, false);
  }
  el.addEventListener(eventName as any, ripple, false);
  el._ripple = {
    event: ripple,
    eventName,
  };
};

const beforeUnmount: DirectiveHook<HTMLElement> = (el, binding) => {
  let ripple: RippleRecord | undefined;
  if (!(ripple = el._ripple)) return;
  if (!ripple.event || !ripple.eventName) return;
  el.removeEventListener(ripple.eventName, ripple.event, false);
  delete el._ripple;
};

export const Ripple: Directive = {
  mounted,
  beforeUnmount,
};
