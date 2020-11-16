const { resolve } = require('path');
const { readdirSync } = require('fs');
const pkgs = readdirSync(resolve(__dirname, './packages'));
const regs = []
const aliasObj = pkgs.reduce((prev, next) => {
  let fullPath = '@lagabu/'
  if(next === 'ako-ui') {
    fullPath = next
  } else  {
    fullPath += next
  }
  regs.push(new RegExp(`("${fullPath}")`));
  prev[`/${fullPath}/`] = resolve(__dirname, './packages/' + next)
  return prev
}, {})
module.exports = {
  alias: aliasObj,
  port: 8080,
  root: resolve(__dirname, 'playground'),
  transforms: [
    {
      test: (ctx) => {
        return !ctx.path.match(/node_modules/);
      },
      transform: (ctx) => {
        let code = ctx.code;
        for (let reg of regs) {
          // replace "@lagabu/*" with /@lagabu/*/src/index
          code = code.replace(reg, `"/${reg.source.replace(/["\\\(\)]/g, '')}/src/index"`)
        }
        return code
      }
    }
  ]
};
