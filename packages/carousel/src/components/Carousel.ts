import vue, { defineComponent, h, PropType, toRef } from 'vue';
import { genModelProps } from '@lagabu/shared';
import { useCarouselProvider } from '../composables';

export default defineComponent({
  name: 'carousel',
  props: {
    ...genModelProps([Number, String]),
    disabled: Boolean,
  },
  setup(props, context) {
    const { clickNext, clickPrev } = useCarouselProvider(props, context);
    return {
      clickPrev,
      clickNext,
    };
  },
  methods: {
    genPrevActivator() {
      return this.$slots.prev
        ? this.$slots.prev({
            onClick: this.clickPrev,
          })
        : h('div', {
            class: 'carousel__activator-prev',
            onClick: this.clickPrev,
          });
    },
    genNextActivator() {
      return this.$slots.next
        ? this.$slots.next({
            onClick: this.clickNext,
          })
        : h('div', {
            class: 'carousel__activator-next',
            onClick: this.clickNext,
          });
    },
    genContent() {
      return h(
        'div',
        {
          class: 'carousel',
        },
        this.$slots.default && this.$slots.default()
      );
    },
  },
  render() {
    // TODO carousel
    return h(
      'div',
      {
        class: 'carousel__container',
      },
      [this.genPrevActivator(), this.genContent(), this.genNextActivator()]
    );
  },
});
