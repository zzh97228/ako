import { App } from 'vue';
import { registerComponents } from '@lagabu/shared';
import { Card, CardTitle, CardContent, CardActions, CardSubtitle } from './components';

export function CardPlugin(Vue: App, opts = {}) {
  registerComponents(Vue, { Card, CardTitle, CardContent, CardActions, CardSubtitle });
}
