import { makeToggleGroup, genGroupProps } from '@lagabu/shared';
import { inject, InjectionKey, provide } from 'vue';

const { innerSymbol: CheckboxSymbol, useGroupConsumer, useGroupProvider, namespace } = makeToggleGroup('CheckboxGroup');
export { CheckboxSymbol, useGroupConsumer, useGroupProvider, namespace, genGroupProps };

export type ChexkboxGroupPara = {
  onBlur: (...args: any[]) => any;
  onFocus: (...args: any[]) => any;
};
export const CheckboxFieldSymbol: InjectionKey<ChexkboxGroupPara & { inGroup: boolean }> = Symbol(
  'CheckboxFieldSymbol'
);
export function useCheckboxGroupProvider(para: ChexkboxGroupPara) {
  provide(CheckboxFieldSymbol, {
    onBlur: para.onBlur,
    onFocus: para.onFocus,
    inGroup: true,
  });
}

export function useCheckboxGroupConsumer() {
  return inject(CheckboxFieldSymbol, {
    onBlur: function (e?: Event) {},
    onFocus: function (e?: Event) {},
    inGroup: false,
  });
}
