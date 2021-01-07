import { App, Component, Directive, FunctionalComponent, h } from 'vue';
import { BaseService } from '../services';

export function isString(str: any): str is string {
  return typeof str === 'string';
}

export function isBool(str: any): str is boolean {
  return typeof str === 'boolean';
}

export function isUndefined(str: any): str is undefined {
  return typeof str === 'undefined';
}

export function isNumber(str: any): str is number {
  return typeof str === 'number';
}
export function isObject(str: any): str is object {
  return typeof str === 'object';
}

export function isArray<T extends any>(str: any): str is Array<T> {
  return Array.isArray(str);
}

export function isFunction(str: any): str is Function {
  return typeof str === 'function';
}

export function isCssColor(str: string | undefined) {
  return !!str && !!str.match(/^(#|(hsl|rgb)a?\(|var\(--)/g);
}

export function hasDocument() {
  return typeof document !== 'undefined';
}

export function hasWindow() {
  return typeof window !== 'undefined';
}

export function convertToUnit(str?: string | number | null, unit = 'px') {
  if (isUndefined(str) || str === null || str === '') return;
  if (isNaN(+str)) {
    return '' + str;
  }
  return String(+str) + unit;
}

export function hyphenate(str: string) {
  return str.replace(/\B([A-Z])/g, '-$1').toLowerCase();
}

export function upperFirst(str: string) {
  if (str.length <= 1) return str.toUpperCase();
  return str.substr(0, 1).toUpperCase() + str.substr(1);
}

export function deepEqual<T extends unknown, U extends unknown>(left: T, right: U): boolean {
  if (left === right) return true;
  if (typeof left !== typeof right) return false;
  if (isObject(left) && isObject(right)) {
    if (Object.keys(left).length !== Object.keys(right).length) return false;
    let flag = true;
    for (let key in left) {
      if (!Object.prototype.hasOwnProperty.call(right, key)) return false;
      flag = deepEqual(left[key], (right as Record<string, any>)[key]);
      if (!flag) return false;
    }
    return flag;
  }
  return false;
}

/**
 * register components
 * @param Vue
 * @param components
 * @param prefix
 */
export function registerComponents(Vue: App, components: Record<string, Component>, prefix = '') {
  let compo: Component;
  for (let key in components) {
    if (Object.prototype.hasOwnProperty.call(components, key)) {
      compo = components[key];
      key = hyphenate(prefix + key);
      Vue.component(key, compo);
    }
  }
}

/**
 * register inner service
 * @param Vue
 * @param services
 * @param opts
 */
export function registerServices(
  Vue: App,
  services: Record<string, typeof BaseService>,
  opts: Record<string, any> = {}
) {
  let service: typeof BaseService;
  for (let sk in services) {
    if (Object.prototype.hasOwnProperty.call(services, sk)) {
      service = services[sk];
      new service(opts).register(Vue);
    }
  }
}

/**
 * register Directives
 * @param Vue
 * @param directives
 */
export function registerDirectives(Vue: App, directives: Record<string, Directive>) {
  for (let dk in directives) {
    if (Object.prototype.hasOwnProperty.call(directives, dk)) {
      Vue.directive(dk, directives[dk]);
    }
  }
}

export function convertToNumber(str: string | number | undefined) {
  if (isUndefined(str)) return NaN;
  const num = Number(str);
  if (isNumber(str) || !isNaN(num)) return num;
  return Number(str.replace(/[^0-9\.\-]/g, ''));
}

export function genFunctionalComponent(
  name: string,
  defaultTag = 'div'
): FunctionalComponent<{
  tag: string;
}> {
  return (props, { slots }) =>
    h(
      props.tag || defaultTag,
      {
        class: hyphenate(name),
      },
      slots.default && slots.default()
    );
}
