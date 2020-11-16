import { VariableService, ColorService, VariableProps, ColorProps } from '@lagabu/shared';
import { GridService, GridProps } from '@lagabu/grid';

export type AkoProps = { [props: string]: any } & VariableProps & ColorProps & GridProps;
export const services = {
  VariableService,
  ColorService,
  GridService,
};
