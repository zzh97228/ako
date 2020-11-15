import { defineComponent, h } from 'vue';
import { useSize, sizeProps } from '@lagabu/shared';

export default defineComponent({
  name: 'ako-card',
  props: {
    ...sizeProps,
  },
  setup(props) {
    const { sizeStyle } = useSize(props);
    return {
      sizeStyle,
    };
  },
  methods: {
    cardContent() {
      return h(
        'div',
        {
          class: 'card__content',
        },
        this.$slots.default && this.$slots.default()
      );
    },
  },
  render() {
    return h(
      'div',
      {
        class: 'card',
        style: this.sizeStyle,
      },
      this.cardContent()
    );
  },
});
