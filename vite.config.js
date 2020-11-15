const { resolve } = require('path');
const { readdirSync } = require('fs');
const pkgs = readdirSync(resolve(__dirname, './packages'));
const regs = []
const aliasObj = pkgs.reduce((prev, next) => {
  regs.push(new RegExp('("@lagabu/' + next + '")'));
  prev[`/@lagabu/${next}/`] = resolve(__dirname, './packages/' + next)
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
