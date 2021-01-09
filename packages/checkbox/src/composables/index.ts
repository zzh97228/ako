import { makeToggleGroup, genGroupProps } from '@lagabu/shared';
import { inject, InjectionKey, provide } from 'vue';

const { innerSymbol: CheckboxSymbol, useGroupConsumer, useGroupProvider, namespace } = makeToggleGroup('CheckboxGroup');
export { CheckboxSymbol, useGroupConsumer, useGroupProvider, namespace, genGroupProps };

export type ChexkboxGroupPara = {
  onBlur: (...args: any[]) => any;
  onFocus: (...args: any[]) => any;
};
export const CheckboxFieldSymbol: InjectionKey<ChexkboxGroupPara> = Symbol('CheckboxFieldSymbol');
export function useCheckboxGroupProvider(para: ChexkboxGroupPara) {
  provide(CheckboxFieldSymbol, {
    onBlur: para.onBlur,
    onFocus: para.onFocus,
  });
}

export function useCheckboxGroupConsumer() {
  return inject(CheckboxFieldSymbol);
}
