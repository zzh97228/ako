import theme from 'vitepress/dist/client/theme-default/index';

export default {
  Layout: theme.Layout,
  NotFound: theme.NotFound, // <- this is a Vue 3 functional component
  enhanceApp({ app, router, siteData }) {
    // app is the Vue 3 app instance from createApp()
    // router is VitePress' custom router (see `lib/app/router.js`)
    // siteData is a ref of current site-level metadata.
  },
};
