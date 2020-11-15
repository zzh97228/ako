const rollup = require('rollup');
const shell = require('shelljs');
const { resolve } = require('path');
const { FORMATS, genRollupObj } = require('../rollup.config');

(async function () {
  const pkgName = process.argv[2];
  if (!pkgName) return console.warn('No Package Specified');
  const pkgFolder = resolve(__dirname, '../packages/' + pkgName);
  try {
    console.log('... 🚀Start Building🚀 ...');
    pkgName === 'ako-ui' && FORMATS.push('iife');
    let isGlobal = false;
    for (let f of FORMATS) {
      console.log(`... Building ${f} ...`);
      isGlobal = pkgName === 'ako-ui' && f === 'iife';
      const { input, output } = genRollupObj(pkgFolder, require(resolve(pkgFolder, 'package.json')), f, isGlobal);
      const bundle = await rollup.rollup(input);
      await bundle.write(output);
    }
    console.log('... Moving Types ...');
    shell.mv(resolve(pkgFolder, 'dist/' + pkgName + '/src/*'), resolve(pkgFolder, 'dist'));
    pkgName === 'ako-ui' && shell.mv(resolve('../packages/global.d.ts'), resolve(pkgFolder, 'dist'));
    shell.rm('-rf', resolve(pkgFolder, 'dist/' + pkgName));
    console.log('... 🌟Complete🌟 ...');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
})();
