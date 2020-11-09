const { createServer } = require('vitepress/dist/node/server');
const { build } = require('vitepress/dist/node/build/build');
const { resolve } = require('path');
const shell = require('shelljs');

const docFolder = resolve(__dirname, '../docs');
const distFolder = resolve(docFolder, 'dist');

const options = {
  root: docFolder,
  port: 3001,
  alias: {
    '/src/': resolve(__dirname, '../src'),
  },
};

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
    await build(options);
    shell.mv(resolve(docFolder, './.vitepress/dist'), distFolder);
    shell.cp(resolve(__dirname, '../.nojekyll'), distFolder);
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

(async function () {
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    await serve();
  } else {
    await builder();
  }
})();
