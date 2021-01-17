import { defineComponent, h } from 'vue';

export default defineComponent({
  name: 'field-group',
  props: {
    tag: {
      type: String,
      default: 'form',
    },
  },
  setup(props) {},
  render() {
    return h(
      this.tag,
      {
        class: 'field-group',
      },
      this.$slots.default && this.$slots.default()
    );
  },
});
