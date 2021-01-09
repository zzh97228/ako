import { Directive, DirectiveBinding, DirectiveHook, isRef, Ref } from 'vue';
import { hasDocument, hasWindow, isBool, isFunction, isObject, isString, isUndefined } from '../utils/helpers';
type OutsideCallback = (e?: Event) => any;
type ClickInclude = () => Array<any>;
type ClickoutsideValue =
  | boolean
  | Ref<boolean>
  | OutsideCallback
  | {
      disabled?: boolean | Ref<boolean>;
      callback?: OutsideCallback;
      include?: ClickInclude;
    }
  | undefined;
export type ClickoutsideBinding = DirectiveBinding<ClickoutsideValue>;
export type ClickoutsideRecord = {
  windowEvent: (...args: any) => any;
};
function isDisabled(val: ClickoutsideValue): boolean {
  if (!val) return true;
  if (isRef(val)) return val.value;
  if (!isFunction(val) && isObject(val)) {
    if (isRef(val.disabled)) {
      return val.disabled.value;
    } else {
      return Boolean(val.disabled);
    }
  }
  return false;
}
function isItemContainTarget(item: any, target: Node): boolean {
  if (!item) return false;
  if (item instanceof Node) {
    return item.contains(target);
  } else if (isRef(item)) {
    return isItemContainTarget(item.value, target);
  } else if (isString(item)) {
    return isItemContainTarget(document.querySelector(item), target);
  }

  return false;
}

const mounted: DirectiveHook = (el: HTMLElement, binding: ClickoutsideBinding) => {
  if (!hasDocument() || el._clickOutside) return;
  const value = binding.value;
  let cb: OutsideCallback | undefined = void 0;
  if (isFunction(value)) {
    cb = value;
  } else if (isObject(value) && !isRef(value)) {
    cb = value.callback;
  }
  let isClickOutside = false;
  function onClick(e: Event) {
    if (isDisabled(value)) {
      return;
    }
    const target = e.target as Node | null;
    if (!target) return;
    const includes = isObject(value) && !isFunction(value) && !isRef(value) && value.include ? value.include : () => [];
    const items = includes.call(null);
    items.push(el);
    isClickOutside = true;
    for (let i = 0; i < items.length; i++) {
      if (isItemContainTarget(items[i], target)) {
        isClickOutside = false;
        break;
      }
    }
    // after update dom then call clickOutside func
    isClickOutside &&
      setTimeout(() => {
        cb && cb.call(null, e);
      }, 0);
  }

  document.documentElement.addEventListener('click', onClick, true);

  el._clickOutside = {
    windowEvent: onClick,
  };
};
const beforeUnmount: DirectiveHook<HTMLElement> = (el) => {
  if (!el._clickOutside) return;
  const rec: ClickoutsideRecord = el._clickOutside;
  document.documentElement.removeEventListener('click', rec.windowEvent, true);

  delete el._clickOutside;
};
export const ClickOutside: Directive<HTMLElement, ClickoutsideBinding> = {
  mounted,
  beforeUnmount,
};
