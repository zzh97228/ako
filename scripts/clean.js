const shelljs = require('shelljs');

shelljs.exec('find ./packages -name "dist"  | xargs rm -rf');
shelljs.exec('find ./docs -name "dist"  | xargs rm -rf');
shelljs.exec('find ./packages -name "lib"  | xargs rm -rf');
shelljs.rm('-rf', './temp', './dist', './docDist')