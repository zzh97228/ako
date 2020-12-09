import { genModelProps, useModel } from '@lagabu/shared';
import { defineComponent, h } from 'vue';
import { useFieldProvider } from '../composables';

export default defineComponent({
  name: 'field',
  props: {
    // ...genModelProps([String, Number, Object]),
  },
  setup(props, context) {
    const modelOptions = useModel(props, context);
    useFieldProvider(modelOptions);
  },
  render() {
    return h(
      'div',
      {
        class: 'field',
      },
      this.$slots.default && this.$slots.default()
    );
  },
});
