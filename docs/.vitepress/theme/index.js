import { DefaultTheme } from 'vitepress';
import Acco from '@lagabu/acco';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@lagabu/theme-default';
import './style.scss';

export default {
  Layout: DefaultTheme.Layout,
  NotFound: DefaultTheme.NotFound,
  enhanceApp({ app }) {
    app.use(Acco, {
      color: {
        theme: {
          primary: 'rgb(237, 109, 61)',
        },
      },
    });
  },
};
