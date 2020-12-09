import { StyleService } from './base';

export const enum ElevationEnum {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
}
export type ElevationOptions = { [prop: string]: string } & {
  [T in ElevationEnum]?: string;
};
export type ElevationProps = {
  elevation?: ElevationOptions;
};
export class ElevationService extends StyleService {
  elevations: ElevationOptions;
  constructor(opts: ElevationProps = {}) {
    super();
    this.elevations = Object.assign({}, opts.elevation);
  }

  genStyleString() {
    let rootStr = '';
    let eVal: string;
    for (let eKey in this.elevations) {
      if ((eVal = this.elevations[eKey])) {
        rootStr += `--elevation-${eKey}: ${eVal};\n`;
      }
    }
    if (!rootStr) return '';
    rootStr = `\n:{\n${rootStr}\n}\n`;
    return rootStr;
  }
}
