import { inject, InjectionKey, onBeforeUnmount, provide } from 'vue';

export const FieldGroupSymbol: InjectionKey<{
  register: (...args: any) => any;
  unregister: (...args: any) => any;
  inFieldGroup: boolean;
}> = Symbol('FieldGroup');
export function useFieldGroupProvider() {
  const fieldChild: any[] = [];

  const register = () => {};
  const unregister = () => {};

  function validate() {}

  provide(FieldGroupSymbol, {
    register,
    unregister,
    inFieldGroup: true,
  });
}

export function useFieldGroupConsumer() {
  const parent = inject(FieldGroupSymbol, {
    register: function () {},
    unregister: function () {},
    inFieldGroup: false,
  });

  if (parent.inFieldGroup) {
    parent.register();

    onBeforeUnmount(() => {
      parent.unregister();
    });
  }
}
