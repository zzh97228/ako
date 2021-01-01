import { DefaultTheme } from 'vitepress';
import Acco from '@lagabu/acco';
import '@lagabu/theme-default';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(Acco);
  },
};
