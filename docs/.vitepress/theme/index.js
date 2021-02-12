import DefaultTheme from 'vitepress/dist/client/theme-default';
import Ako from '@lagabu/ako';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@lagabu/theme-default';
import './style.scss';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(Ako, {
      color: {
        theme: {
          primary: 'rgb(237, 109, 61)',
        },
      },
    });
  },
};
