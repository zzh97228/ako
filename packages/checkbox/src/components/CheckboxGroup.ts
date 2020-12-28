import vue, { defineComponent, h } from 'vue';
import { useGroupProvider, genGroupProps } from '../composables';

export default defineComponent({
  name: 'checkbox-group',
  props: {
    ...genGroupProps(),
  },
  setup(props, context) {
    const { lazyState } = useGroupProvider(props, context);
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
