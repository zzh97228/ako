const rollup = require('rollup');
const shell = require('shelljs');
const { resolve } = require('path');
const { readdirSync, existsSync } = require('fs');
const { FORMATS, genRollupObj } = require('../rollup.config');
const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor');
const pkgJson = require('../package.json');

async function build(pkgName) {
  let clonedFormats = [...FORMATS];
  const pkgFolder = resolve(__dirname, '../packages/' + pkgName);
  try {
    console.log('... 🚀Start Building🚀 ...');
    if (pkgName === 'theme-default') {
      clonedFormats = ['esm'];
    }

    async function buildRollup(global) {
      for (let f of clonedFormats) {
        console.log(`... Building${global ? ' Browser' : ''} ${f} ...`);
        const { input, output } = genRollupObj(pkgFolder, require(resolve(pkgFolder, 'package.json')), f, global);
        const bundle = await rollup.rollup(input);
        await bundle.write(output);
      }
    }

    await buildRollup();
    if (pkgName === pkgJson.name) {
      await buildRollup(true)
    }

    // packages' api-extractor.json
    const apiExtractorFile = resolve(pkgFolder, 'api-extractor.json');
    if (existsSync(apiExtractorFile)) {
      // Load and parse the api-extractor.json file
      const extractorConfig = ExtractorConfig.loadFileAndPrepare(apiExtractorFile);

      // Invoke API Extractor
      const extractorResult = Extractor.invoke(extractorConfig, {
        // Equivalent to the "--local" command-line parameter
        localBuild: true,

        // Equivalent to the "--verbose" command-line parameter
        // showVerboseMessages: true,
      });

      if (extractorResult.succeeded) {
        console.log(`API Extractor completed successfully`);
        process.exitCode = 0;
      } else {
        console.error(
          `API Extractor completed with ${extractorResult.errorCount} errors` +
            ` and ${extractorResult.warningCount} warnings`
        );
        process.exitCode = 1;
      }
    }
    // rm temp folder
    console.log('... Removing temp folder');
    shell.rm('-rf', resolve(pkgFolder, 'dist/temp'));
    if (pkgName === 'theme-default') {
      // copy styles to dist
      console.log('... Copying style folder');
      const styleFolder = resolve(pkgFolder, 'lib');
      shell.exec('mkdir -p ' + styleFolder);
      shell.cp('-R', resolve(pkgFolder, 'src/*'), styleFolder);
      shell.rm('-rf', resolve(styleFolder, 'index.ts'));
    }
    console.log('... 🌟Complete🌟 ...');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

(async function () {
  let pkgName = process.argv[2];
  let pkgs = [];
  if (!pkgName) {
    pkgs = readdirSync(resolve(__dirname, '../packages'));
  } else {
    pkgs.push(pkgName);
  }

  try {
    for (let p of pkgs) {
      await build(p);
    }
  } catch (err) {
    console.error(err);
  }
})();
