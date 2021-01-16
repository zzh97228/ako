const { readdirSync } = require('fs');
const { resolve } = require('path');
const viteConfig = require('../../vite.config');
const componentsFiles = readdirSync(resolve(__dirname, `../components`)),
  directivesFiles = readdirSync(resolve(__dirname, `../directives`));
function getFilesTemplate(dirName) {
  let files = [];
  switch (dirName) {
    case 'directives': {
      files = directivesFiles;
      break;
    }
    case 'components':
    default: {
      files = componentsFiles;
      break;
    }
  }
  return {
    text: dirName.substr(0, 1).toUpperCase() + dirName.substr(1),
    children: files.sort().map((f) => {
      f = f.replace(/(\.md)/g, '');
      return { text: f, link: `/${dirName}/${f}` };
    }),
  };
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
  alias: getAlias(),
  base: process.env.NODE_ENV === 'production' ? '/acco/' : '/',
  themeConfig: {
    repo: 'zzh97228/acco',
    nav: [
      { text: 'Guide', link: '/guide/introduction', activeMatch: '^/guide/' },
      { text: 'Components', link: '/components/btn', activeMatch: '^/components/' },
      { text: 'Directives', link: '/directives/ripple', activeMatch: '^/directives/' },
    ],
    sidebar: [
      {
        text: 'Introduction',
        children: [
          { text: 'What is Acco?', link: '/guide/introduction' },
          { text: 'Getting Start', link: '/guide/start' },
          { text: 'Colors', link: '/guide/colors' },
          { text: 'Elevation', link: '/guide/elevation' },
        ],
      },
      getComponents(),
      getDirectives(),
    ],
  },
};
