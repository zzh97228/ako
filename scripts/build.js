const shell = require('shelljs');
const { resolve } = require('path');
const ts = require('rollup-plugin-typescript2'),
  { nodeResolve } = require('@rollup/plugin-node-resolve'),
  postcss = require('rollup-plugin-postcss'),
  cssnano = require('cssnano'),
  autoprefixer = require('autoprefixer');

const rollup = require('rollup');

const FORMATS = ['es', 'umd', 'cjs'];

function genRollupObj(packageFolder, pkg, format) {
  const name = (String(pkg.name) || '').replace(/(@lagabu\/)/, '');
  const external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];
  return {
    input: {
      input: resolve(packageFolder, 'src/index.ts'),
      external,
      plugins: [
        nodeResolve(),
        ts({
          tsconfig: resolve(__dirname, '../tsconfig.json'),
          tsconfigOverride: {
            compilerOptions: {
              declaration: format && format === 'es',
              rootDir: resolve(__dirname, '../packages'),
            },
            exclude: ['**/node_modules', '**/__tests__', '**/dist'],
          },
        }),
        postcss({
          plugins: [
            autoprefixer(),
            cssnano({
              preset: [
                'default',
                {
                  discardDuplicates: true,
                },
              ],
            }),
          ],
          extract: format === 'es' && pkg.name + '.min.css',
          inject: false,
        }),
      ],
    },
    output: {
      dir: resolve(packageFolder, 'dist'),
      format,
      globals: external.reduce((prev, next) => {
        prev[next] = next;
        return prev;
      }, {}),
      name,
      entryFileNames: name + '.' + format + '.bundle.js',
      extend: true,
    },
  };
}

(async function () {
  try {
    // TODO
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();
