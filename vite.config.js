const { resolve } = require('path');
module.exports = {
  alias: {
    '/src/': resolve(__dirname, './src'),
  },
  port: 8080,
  root: resolve(__dirname, 'playground'),
};
