import { App } from 'vue';
import { registerServices } from '@lagabu/shared';
import { MessageService, MessageOptions } from './service';

export type MessageProps = {};
export function MessagePlugin(Vue: App, opts: MessageProps = {}) {
  registerServices(Vue, { MessageService }, opts);
}
