const { createServer, build } = require('vitepress');
const { resolve } = require('path');
const shell = require('shelljs');
const config = require('../vite.config');

const docFolder = resolve(__dirname, '../docs');
const distFolder = resolve(docFolder, 'dist');

const options = Object.assign({}, config, {
  root: resolve(__dirname, '../docs'),
  port: 3000,
});

async function serve() {
  try {
    console.log('... serving ...');
    const server = await createServer(options);
    server.listen(options.port);
    console.log(`serving at http://localhost:${options.port}`);
  } catch (err) {
    console.error(err);
  }
}

async function builder() {
  try {
    console.log('... cleaning dist ...');
    shell.rm('-rf', distFolder);
    console.log('... building ...');
    await build(options.root, options);
    shell.mv(resolve(docFolder, './.vitepress/dist'), distFolder);
    shell.cp(resolve(__dirname, '../.nojekyll'), distFolder);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

(async function () {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    await serve();
  } else {
    await builder();
  }
})();
