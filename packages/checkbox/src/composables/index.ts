import { makeToggleGroup, genGroupProps } from '@lagabu/shared';

const { innerSymbol: CheckboxSymbol, useGroupConsumer, useGroupProvider, namespace } = makeToggleGroup('CheckboxGroup');
export { CheckboxSymbol, useGroupConsumer, useGroupProvider, namespace, genGroupProps };
