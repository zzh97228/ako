const { readdirSync } = require('fs');
const { resolve } = require('path');

module.exports = {
  title: 'Ako',
  description: 'Documentation of ako-ui',
  base: process.env.NODE_ENV === 'production' ? '/ako-ui/' : '/',
  themeConfig: {
    repo: 'zzh97228/ako-ui',
    nav: [
      { text: 'Components', link: '/components/grid' },
      { text: 'Directives', link: '/directives/ripple' },
    ],
    sidebar: {
      '/components/': getComponents(),
      '/directives/': getDirectives(),
    },
  },
};

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
