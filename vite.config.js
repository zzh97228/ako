const { resolve } = require('path');
const { readdirSync } = require('fs');
const pkgs = readdirSync(resolve(__dirname, './packages'));
const vue = require('@vitejs/plugin-vue');

const aliasObj = pkgs.map((p) => {
 return {
    find: `@lagabu/${p}`,
    replacement: resolve(__dirname, `./packages/${p}/src/index`),
  }
});

module.exports = {
  alias: aliasObj,
  root: resolve(__dirname, 'playground'),
  plugins: [vue()],
  server: {
    port: 3000,
  },
};
