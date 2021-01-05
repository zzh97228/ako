const { readdirSync } = require('fs');
const { resolve } = require('path');
const viteConfig = require('../../vite.config');
function getFilesTemplate(dirName) {
  const files = readdirSync(resolve(__dirname, `../${dirName}`));
  return [
    {
      text: dirName.substr(0, 1).toUpperCase() + dirName.substr(1),
      children: files.sort().map((f) => {
        f = f.replace(/(\.md)/g, '');
        f = f.substr(0, 1).toUpperCase() + f.substr(1);
        return { text: f, link: `/${dirName}/${f.toLowerCase()}` };
      }),
    },
  ];
}

function getComponents() {
  return getFilesTemplate('components');
}

function getDirectives() {
  return getFilesTemplate('directives');
}

function getAlias() {
  return viteConfig.alias.reduce((prev, next) => {
    prev[next.find] = next.replacement;
    return prev;
  }, {});
}

module.exports = {
  title: 'Acco',
  description: 'Documentation of acco',
  base: process.env.NODE_ENV === 'production' ? '/acco/' : '/',
  alias: getAlias(),
  themeConfig: {
    repo: 'zzh97228/acco',
    nav: [
      { text: 'Guide', link: '/guide/index' },
      { text: 'Components', link: '/components/grid' },
      { text: 'Directives', link: '/directives/ripple' },
    ],
    sidebar: {
      '/components/': getComponents(),
      '/directives/': getDirectives(),
      '/guide/': [
        {
          text: 'Introduction',
          children: [
            { text: 'What is Acco?', link: '/guide/index' },
            { text: 'Getting Start', link: '/guide/start' },
            { text: 'Colors', link: '/guide/colors' },
          ],
        },
      ],
    },
  },
};
