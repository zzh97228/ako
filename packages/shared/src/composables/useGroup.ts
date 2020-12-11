import vue, { inject, InjectionKey, onBeforeUnmount, provide } from 'vue';
import { upperFirst } from '../utils/helpers';

export type IGroup = {
  innerSymbol: InjectionKey<
    {
      register: () => any;
      unregister: () => any;
    } & {
      [props: string]: boolean;
    }
  >;
  useGroupProvider: () => any;
  useGroupConsumer: () => any;
};

export function makeGroupComposition(symbolName = 'Group') {
  const inGroupKey = `in${upperFirst(symbolName)}`;
  let groupUID = 0;
  const result: IGroup = {
    innerSymbol: Symbol(symbolName),
    useGroupProvider() {
      const instanceMap = new Map<number, any>();

      const register = () => {};
      const unregister = () => {};

      provide(result.innerSymbol, {
        [inGroupKey]: true,
        register,
        unregister,
      });
    },
    useGroupConsumer() {
      const group = inject(result.innerSymbol, {
        [inGroupKey]: false,
        register: (...args: any[]) => {},
        unregister: (...args: any[]) => {},
      });
      if (group[inGroupKey]) {
        // TODO Group consumer
        group.register();

        onBeforeUnmount(() => {
          group.unregister();
        });
      }
    },
  };
  return result;
}

const { innerSymbol: GroupSymbol, useGroupConsumer, useGroupProvider } = makeGroupComposition();
export { GroupSymbol, useGroupConsumer, useGroupProvider };
