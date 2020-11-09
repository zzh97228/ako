const shelljs = require('shelljs');

shelljs.exec('find ./packages -name "dist"  | xargs rm -rf');
