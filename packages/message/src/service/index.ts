import { BaseService, hasWindow, isObject, isString } from '@lagabu/shared';
import {
  App,
  defineComponent,
  getCurrentInstance,
  h,
  onBeforeUnmount,
  useContext,
  onMounted,
  PropType,
  reactive,
  render,
  toRef,
  VNodeArrayChildren,
} from 'vue';
import { Message } from '../components';

const MessageList = defineComponent({
  name: 'MessageList',
  props: {
    map: {
      type: Object as PropType<Map<number, any>>,
      default: () => new Map(),
    },
  },
  setup(props) {
    const instances = toRef(props, 'map');

    return () => {
      if (!instances.value) return;
      const children: VNodeArrayChildren = [];
      for (const [key, value] of instances.value.entries()) {
        children.push(
          h(
            Message,
            { key, id: 'message-' + key },
            {
              default: () => value.data,
            }
          )
        );
      }

      return children;
    };
  },
});

interface DefaultMessageOptions extends Record<string, any> {
  data: string;
  duration: number;
}
export type MessageOptions = string | DefaultMessageOptions;
export type MessageMap = Map<number, MessageOptions>;
const defaultMessageOptions: DefaultMessageOptions = {
  data: '',
  duration: 3000,
};
let msgId = 0;
export class MessageService extends BaseService {
  messageMap: MessageMap;
  constructor() {
    super();
    this.messageMap = reactive(new Map());
  }
  message(opts: MessageOptions) {
    const currId = msgId++;
    const options = Object.assign(
      isString(opts)
        ? {
            data: opts,
          }
        : opts,
      defaultMessageOptions
    );
    this.messageMap.set(currId, options);
    let timerId = setTimeout(() => {
      if (this.messageMap.has(currId)) {
        this.messageMap.delete(currId);
      }
      clearTimeout(timerId);
    }, options.duration);
  }

  register(Vue: App) {
    if (Vue.config.globalProperties.$message) {
      return;
    }
    let root: null | HTMLElement;
    if (!hasWindow() || !(root = document.querySelector('body'))) return;
    render(h(MessageList, { map: this.messageMap }), root);
    Vue.config.globalProperties.$message = this.message;
  }
}
