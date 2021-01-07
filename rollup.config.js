const { resolve } = require('path');
const ts = require('rollup-plugin-typescript2'),
  { nodeResolve } = require('@rollup/plugin-node-resolve'),
  postcss = require('rollup-plugin-postcss'),
  cssnano = require('cssnano'),
  autoprefixer = require('autoprefixer'),
  { terser } = require('rollup-plugin-terser');

const FORMATS = ['esm', 'umd', 'cjs'];

function genRollupObj(packageFolder, pkg, format, isGlobal = false) {
  function isESM() {
    return !!format && format === 'esm';
  }
  const name = (String(pkg.name) || '').replace(/(@lagabu\/)/, '');
  const external = isGlobal
    ? [...Object.keys(pkg.peerDependencies || {})]
    : [...Object.keys(pkg.peerDependencies || {}), ...Object.keys(pkg.dependencies || {})];
  const plugins = isESM() ? [] : [terser()];

  return {
    input: {
      input: resolve(packageFolder, 'src/index.ts'),
      external,
      plugins: [
        nodeResolve(),
        ts({
          useTsconfigDeclarationDir: isESM(),
          tsconfig: resolve(__dirname, './tsconfig.json'),
          tsconfigOverride: {
            compilerOptions: {
              declaration: isESM(),
              declarationMap: isESM(),
              declarationDir: resolve(packageFolder, 'dist/temp'),
            },
            exclude: ['**/node_modules', '**/__tests__', '**/dist', 'playground'],
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
          extract: isESM() && resolve(packageFolder, 'dist/all.min.css'),
          inject: false,
        }),
        ...plugins,
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
      entryFileNames: name + '.' + format + (isGlobal ? '.browser' : '') + '.bundle.js',
      extend: true,
      exports: 'auto',
    },
  };
}

module.exports = {
  FORMATS,
  genRollupObj,
};
