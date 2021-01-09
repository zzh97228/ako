import { useFieldConsumer } from '@lagabu/shared';
import vue, { defineComponent, h, provide } from 'vue';
import { useGroupProvider, genGroupProps, CheckboxSymbol, useCheckboxGroupProvider } from '../composables';

export default defineComponent({
  name: 'checkbox-group',
  props: {
    ...genGroupProps(),
  },
  setup(props, context) {
    const { lazyState, model, setInnerState } = useGroupProvider(props, context);
    const { onBlur, onFocus } = useFieldConsumer({ lazyState: lazyState as any, model, setInnerState });
    useCheckboxGroupProvider({ onBlur, onFocus });
    return {
      lazyState,
    };
  },
  render() {
    return h(
      'div',
      {
        class: 'checkbox-group',
      },
      this.$slots.default && this.$slots.default()
    );
  },
});
