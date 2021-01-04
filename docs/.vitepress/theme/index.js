import { DefaultTheme } from 'vitepress';
import Acco from '@lagabu/acco';
import '@lagabu/theme-default';

export default {
  Layout: DefaultTheme.Layout,
  NotFound: DefaultTheme.NotFound,
  enhanceApp({ app }) {
    app.use(Acco);
  },
};
