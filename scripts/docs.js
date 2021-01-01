const { build, resolveConfig } = require('vitepress');
const { createVitePressPlugin } = require('vitepress/dist/node/plugin');
const { createServer } = require('vite');
const { resolve } = require('path');
const shell = require('shelljs');
const docFolder = resolve(__dirname, '../docs');
const distFolder = resolve(docFolder, 'dist');

const options = {
  port: 8080,
  root: resolve(__dirname, '../docs'),
};

async function serve() {
  try {
    console.log('... serving ...');
    const config = await resolveConfig(options.root);
    const site = config.site;
    const server = await createServer({
      root: options.root,
      plugins: [
        ...createVitePressPlugin(options.root, config),
        {
          config() {
            return {
              define: {
                __CARBON__: !!site.themeConfig.carbonAds?.carbon,
                __BSA__: !!site.themeConfig.carbonAds?.custom,
                __ALGOLIA__: !!site.themeConfig.algolia
              }
            };
          },
        },
      ],
      server: {
        port: options.port,
      },
    });
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
    await build(options.root);
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
