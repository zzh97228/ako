import vue, {
  computed,
  ExtractPropTypes,
  inject,
  InjectionKey,
  isReadonly,
  isRef,
  onBeforeUnmount,
  PropType,
  provide,
  ref,
  Ref,
  SetupContext,
  toRef,
} from 'vue';
import { deepEqual, isArray, isNumber, isUndefined, upperFirst } from '../utils/helpers';
import { ModelReturn, useModel } from './useModel';

type GroupValue = number | number[] | undefined;
type ConsumerResult = { [prop: string]: any } & {
  onToggle: () => any;
  notAllowed: Ref<boolean>;
};
export type IGroup = {
  namespace: string;
  innerSymbol: InjectionKey<
    {
      register: (...args: any[]) => ConsumerResult;
      unregister: (...args: any[]) => void;
      notAllowed: Ref<boolean>;
    } & {
      [props: string]: boolean;
    }
  >;
  useGroupProvider: (props: GroupPropsType, context: SetupContext) => ModelReturn<number | number[] | undefined>;
  useGroupConsumer: (isActive: Ref<boolean>, toggleable?: boolean) => ConsumerResult;
};

export function genGroupProps() {
  return {
    disabled: Boolean,
    multiple: Boolean,
    modelValue: [Array, Number] as PropType<Array<number> | number>,
  };
}
type GroupInstance = {
  id: number;
  isActive: Ref<boolean>;
};
export type GroupPropsType = ExtractPropTypes<ReturnType<typeof genGroupProps>>;
export function makeToggleGroup(symbolName = 'ToggleGroup') {
  const gNamespace = `in${upperFirst(symbolName)}`;
  let groupUID = 0;
  const result: IGroup = {
    namespace: gNamespace,
    innerSymbol: Symbol(symbolName),
    useGroupProvider(props: GroupPropsType, context: SetupContext) {
      const notAllowed = toRef(props, 'disabled');
      // instances array should not be reactive,
      // cause isActive value would be unref()
      const ists: Array<GroupInstance> = [];
      // normalize value
      function normalize(value: GroupValue) {
        if (isUndefined(value)) {
          return props.multiple ? [] : undefined;
        } else if (isArray(value)) {
          return props.multiple ? value.filter((v) => isNumber(v)) : value[0];
        } else {
          return props.multiple ? [value] : value;
        }
      }

      function setIsActive(isActive: Ref<boolean>, value: boolean) {
        if (isReadonly(isActive)) return;
        isActive.value = value;
      }

      function updateChildren(newVal: any) {
        const normalizedValue = normalize(newVal);
        let child: GroupInstance,
          innerValue = false;
        for (let i = 0; i < ists.length; i++) {
          child = ists[i];
          if (props.multiple) {
            innerValue = (normalizedValue as number[]).indexOf(i) >= 0;
          } else {
            innerValue = i === normalizedValue;
          }
          setIsActive(child.isActive, innerValue);
        }
        return normalizedValue;
      }
      const { lazyState, model, setInnerState } = useModel(
        props,
        context,
        toRef(props, 'disabled'),
        (innerState, newVal, oldVal) => {
          if (deepEqual(newVal, oldVal)) return;
          let value = updateChildren(newVal);
          innerState.value = value;
        }
      );

      function setMultipleModelValue() {
        model.value = ists.reduce((prev, next, index) => {
          if (next.isActive.value) {
            prev.push(index);
          }
          return prev;
        }, [] as number[]);
      }

      function findSingleModelValue() {
        return ists.findIndex((instance) => instance.isActive.value);
      }

      function clickItem(id: number) {
        let idx = ists.findIndex((instance) => instance.id === id);
        if (idx < 0 || props.disabled) return;
        if (props.multiple) {
          setMultipleModelValue();
        } else {
          let child: GroupInstance = ists[idx];
          if (!child.isActive.value) {
            idx = findSingleModelValue();
            if (idx < 0) {
              model.value = undefined;
              return;
            }
          }
          ists.forEach((instance, index) => {
            if (index !== idx) setIsActive(instance.isActive, false);
          });
          model.value = idx;
        }
      }

      function register(id: number, isActive: Ref<boolean>) {
        ists.push({
          id,
          isActive,
        });
        return {
          onToggle: () => {
            clickItem(id);
          },
        };
      }
      function unregister(id: number) {
        let index = ists.findIndex((value) => value.id === id);
        if (index < 0) return;
        ists.splice(index, 1);
        if (props.multiple) {
          setMultipleModelValue();
        } else {
          const idx = findSingleModelValue();
          model.value = idx < 0 ? undefined : idx;
        }
      }
      // normalize modelValue and set active when created
      const normalizedValue = updateChildren(lazyState.value);
      setInnerState(normalizedValue);

      // provide symbol
      provide(result.innerSymbol, {
        [gNamespace]: true,
        register,
        unregister,
        notAllowed,
      });

      return {
        lazyState,
        model,
        setInnerState,
        notAllowed,
      };
    },
    useGroupConsumer(isActive: Ref<boolean>, toggleable?: boolean) {
      const group = inject(result.innerSymbol, {
        [gNamespace]: false,
        register: (...args: any[]) => ({
          onToggle: () => {},
        }),
        unregister: (...args: any[]) => {},
        notAllowed: ref(false),
      });
      const consumerResult = {
        onToggle: () => {},
        [gNamespace]: group[gNamespace],
        notAllowed: group.notAllowed,
      };
      if (group[gNamespace] && toggleable) {
        const id = groupUID++;
        const { onToggle } = group.register(id, isActive);
        consumerResult.onToggle = onToggle;

        onBeforeUnmount(() => {
          group.unregister(id);
        });
      }

      return consumerResult;
    },
  };
  return result;
}

const { innerSymbol: toggleGroupSymbol, useGroupConsumer, useGroupProvider } = makeToggleGroup();
export { toggleGroupSymbol, useGroupConsumer, useGroupProvider };
