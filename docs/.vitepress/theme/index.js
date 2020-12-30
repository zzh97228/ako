import theme from 'vitepress/dist/client/theme-default';
import Ako from '@lagabu/ako';
import '@lagabu/theme-default';
import './styles.css'

export default {
  Layout: theme.Layout,
  NotFound: theme.NotFound, // <- this is a Vue 3 functional component
  enhanceApp({ app, router, siteData }) {
    app.use(Ako);
    // app is the Vue 3  app instance from createApp()
    // router is VitePress' custom router (see `lib/app/router.js`)
    // siteData is a ref of current site-level metadata.
  },
};
