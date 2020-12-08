const { resolve } = require('path');
const ts = require('rollup-plugin-typescript2'),
  { nodeResolve } = require('@rollup/plugin-node-resolve'),
  postcss = require('rollup-plugin-postcss'),
  cssnano = require('cssnano'),
  autoprefixer = require('autoprefixer'),
  { terser } = require('rollup-plugin-terser');

const FORMATS = ['es', 'umd', 'cjs'];

function genRollupObj(packageFolder, pkg, format, global = false) {
  const name = (String(pkg.name) || '').replace(/(@lagabu\/)/, '');
  const external = [...Object.keys(pkg.peerDependencies || {})];
  if (!global) {
    external.push(...Object.keys(pkg.dependencies || {}));
  }
  const globals = Object.keys(pkg.devDependencies || {}).reduce((prev, next) => {
    if (!next.match(/^@lagabu\/(.*)$/)) return prev;
    prev[next] = resolve(__dirname, './packages/' + RegExp.$1 + '/src');
    return prev;
  }, {});
  const plugins = [terser()];
  function isESM() {
    return !!format && format === 'es';
  }
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
          extract: isESM() && resolve(packageFolder, 'dist/' + name + '.min.css'),
          inject: false,
        }),
        ...plugins,
      ],
    },
    output: {
      dir: resolve(packageFolder, 'dist'),
      format,
      globals: {
        ...globals,
        ...external.reduce((prev, next) => {
          prev[next] = next;
          return prev;
        }, {}),
      },
      name,
      entryFileNames: name + '.' + format + '.bundle.js',
      extend: true,
      exports: 'auto',
    },
  };
}

module.exports = {
  FORMATS,
  genRollupObj,
};
