import { genToggleProps, useToggle, useSize, sizeProps } from '@lagabu/shared';
import vue, { defineComponent, h, ref, Transition, vShow, withDirectives } from 'vue';
import { useCarouselConsumer } from '../composables';

export default defineComponent({
  name: 'carousel-item',
  props: {
    ...genToggleProps('carousel-item--active'),
    ...sizeProps,
  },
  setup(props) {
    const { isActive } = useToggle(props);
    const { sizeStyle } = useSize(props);
    const { setParentHeight, transitionName, transitionCount } = useCarouselConsumer(isActive);
    const inTransition = ref(false);
    return {
      isActive,
      sizeStyle,
      transitionName,
      transitionCount,
      setParentHeight,
      inTransition,
    };
  },
  methods: {
    genContent() {
      return h(
        'div',
        {
          class: {
            'carousel-item': true,
            [this.activeClass]: Boolean(this.isActive),
          },
          style: this.sizeStyle,
        },
        this.$slots.default && this.$slots.default()
      );
    },
    onAfter() {
      if (!this.inTransition) return;

      this.inTransition = false;
      if (this.transitionCount > 0) {
        this.transitionCount--;
        if (this.transitionCount === 0) {
          this.setParentHeight(null);
        }
      }
    },
    onBefore(el: HTMLElement) {
      if (this.inTransition) return;

      this.inTransition = true;
      if (this.transitionCount === 0) {
        let parent: Element | null;
        if ((parent = el.parentElement)) {
          this.setParentHeight(parent.clientHeight);
        }
      }
      this.transitionCount++;
    },
    onEnter(el: HTMLElement) {
      if (!this.inTransition) return;
      this.$nextTick(() => {
        if (!this.inTransition) return;
        this.setParentHeight(el.clientHeight);
      });
    },
    genTransition() {
      return h<any>(
        Transition,
        {
          name: this.transitionName,
          onBeforeEnter: this.onBefore,
          onEnter: this.onEnter,
          onAfterEnter: this.onAfter,
          onEnterCancelled: this.onAfter,
          onBeforeLeave: this.onBefore,
          onAfterLeave: this.onAfter,
          onLeaveCancelled: this.onAfter,
        },
        {
          default: () => withDirectives(this.genContent(), [[vShow, this.isActive]]),
        }
      );
    },
  },
  render() {
    return this.genTransition();
  },
});
