import { defineComponent, h } from 'vue';
import { useCarouselConsumer } from '../composables';

export default defineComponent({
  name: 'carousel-item',
  setup() {
    useCarouselConsumer();
  },
  render() {
    // TODO carsousel-item
    return h('div', {
      class: 'carousel-item',
    });
  },
});
