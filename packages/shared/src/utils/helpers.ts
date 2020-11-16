import { App, Component } from 'vue';
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

export function isCssColor(str: string | undefined) {
  return !!str && !!str.match(/^(#|(hsl|rgb)a?\(|var\(--)/g)
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

export function convertToNumber(str: string | number | undefined) {
  if (isUndefined(str)) return NaN;
  if (isNumber(str) || !isNaN(+str)) return +str;
  return +str.replace(/[^0-9\.\-]/g, '');
}
