import { App } from 'vue';
import { hasDocument, hasWindow } from '../utils/helpers';

export type IService = {
  register: (Vue: App, ...args: any[]) => any;
};
export class BaseService implements IService {
  constructor(...args: any) {}
  register(Vue: App, ...args: any) {
    if (!Vue.config.globalProperties.$ako) {
      Vue.config.globalProperties.$ako = {};
    }
  }
}
export const styleId = 'addon-styles';
export class StyleService extends BaseService implements IService {
  private uid = styleId;
  constructor() {
    super();
  }
  protected genStyleString() {
    return '';
  }

  appendStyle() {
    if (!hasWindow() || !hasDocument()) return;
    const id = this.uid,
      str = this.genStyleString();
    if (!str) return;
    let styleElem: HTMLStyleElement | null;
    if (!(styleElem = document.head.querySelector('#' + id))) {
      styleElem = document.createElement('style');
      styleElem.setAttribute('type', 'text/css');
      styleElem.setAttribute('id', id);
      styleElem.innerHTML = str;
      document.head.appendChild(styleElem);
    } else {
      styleElem.innerHTML += '\n' + str;
    }
  }

  register(Vue: App) {
    super.register(Vue);
    this.appendStyle();
  }
}
