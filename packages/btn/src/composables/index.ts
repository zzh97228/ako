import { makeToggleGroup } from '@lagabu/shared';
const { innerSymbol: BtnToggleSymbol, useGroupProvider, useGroupConsumer, namespace } = makeToggleGroup(
  'BtnToggleGroup'
);

export { BtnToggleSymbol, useGroupConsumer, useGroupProvider, namespace };
