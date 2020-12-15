import { genGroupProps } from '@lagabu/shared';
import vue, { defineComponent, h } from 'vue';
import { useGroupProvider } from '../composables';
export default defineComponent({
  name: 'btn-toggle-group',
  props: genGroupProps(),
  setup(props, context) {
    useGroupProvider(props, context);
  },
  render() {
    return h(
      'div',
      {
        class: 'btn-toggle-group',
      },
      this.$slots.default && this.$slots.default()
    );
  },
});
