import vue, { defineComponent, h, onBeforeUnmount, onMounted, PropType, toRef } from 'vue';
import { carouselProps, useCarouselProvider } from '../composables';

export default defineComponent({
  name: 'carousel',
  props: carouselProps,
  setup(props) {
    const { clickNext, clickPrev, transitionHeight } = useCarouselProvider(props);
    return {
      clickPrev,
      clickNext,
      transitionHeight,
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
          style: {
            height: this.transitionHeight,
          },
        },
        this.$slots.default && this.$slots.default()
      );
    },
  },
  render() {
    return h(
      'div',
      {
        class: 'carousel__wrapper',
      },
      [this.genPrevActivator(), this.genContent(), this.genNextActivator()]
    );
  },
});
