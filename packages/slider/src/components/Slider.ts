import { genPercentProps, usePercent, useSize, sizeProps, clamp } from '@lagabu/shared';
import vue, { computed, defineComponent, h, reactive, ref } from 'vue';

export default defineComponent({
  name: 'slider',
  props: {
    ...genPercentProps(),
    ...sizeProps,
    vertical: Boolean,
    reverse: Boolean,
  },
  setup(props, context) {
    const { percent } = usePercent(props, context),
      { sizeStyle } = useSize(props),
      pointerRef = ref<null | HTMLElement>(null),
      sliderRef = ref<null | HTMLElement>(null),
      state = reactive({
        frameId: 0,
        isPointing: false,
        prevPercent: 0,
      }),
      backStyle = computed<Record<string, any>>(() => {
        const result: Record<string, any> = {
          position: 'absolute',
        };
        if (props.vertical) {
          result[props.reverse ? 'top' : 'bottom'] = '0px';
          result[props.reverse ? 'bottom' : 'top'] = 'auto';
        } else {
          result[props.reverse ? 'right' : 'left'] = '0px';
          result[props.reverse ? 'left' : 'right'] = 'auto';
        }
        result[props.vertical ? 'height' : 'width'] = (percent.value * 100).toFixed(2) + '%';
        return result;
      }),
      pointerStyle = computed(() => {
        const pStr = (percent.value * 100).toFixed(2) + '%';
        const result: Record<string, any> = {
          position: 'absolute',
        };
        if (props.vertical) {
          result[props.reverse ? 'top' : 'bottom'] = pStr;
          result[props.reverse ? 'bottom' : 'top'] = 'auto';
        } else {
          result[props.reverse ? 'right' : 'left'] = pStr;
          result[props.reverse ? 'left' : 'right'] = 'auto';
        }
        return result;
      });

    function getPercent(sliderELm: HTMLElement, e: PointerEvent): number {
      const { width, height, x: x1, y: y1 } = sliderELm.getBoundingClientRect(),
        x = e.clientX,
        y = e.clientY;
      let v = props.vertical ? y - y1 : x - x1;
      if (props.reverse) {
        v = props.vertical ? height - v : width - v;
      }
      v = props.vertical ? v / height : v / width;
      return v;
    }

    function onPointerdown(e: PointerEvent) {
      let slider: HTMLElement | null;
      if (props.disabled || !(slider = sliderRef.value)) {
        return;
      }
      state.isPointing = true;
      percent.value = getPercent(slider, e);
      state.prevPercent = percent.value;
    }
    function onPointermove(e: PointerEvent) {
      if (props.disabled || !state.isPointing || state.frameId) {
        return;
      }
      state.frameId = requestAnimationFrame(() => {
        let slider: HTMLElement | null;
        if (!(slider = sliderRef.value)) return;
        const p = getPercent(slider, e);
        if (p !== percent.value) {
          percent.value = p;
        }
        state.frameId = 0;
      });
    }
    function onPointerup() {
      if (props.disabled || state.prevPercent === percent.value) return;
      state.isPointing = false;
    }

    return {
      sizeStyle,
      onPointerdown,
      onPointermove,
      onPointerup,
      pointerRef,
      sliderRef,
      backStyle,
      pointerStyle,
    };
  },
  methods: {
    genSlider() {
      return h(
        'div',
        {
          class: 'slider',
          ref: 'sliderRef',
        },
        [this.genPointer(), this.genBackground()]
      );
    },
    genBackground() {
      return h('div', {
        class: 'slider__background',
        style: this.backStyle,
        onPointerdown: this.onPointerdown,
        onPointermove: this.onPointermove,
        onPointerup: this.onPointerup,
      });
    },
    genPointer() {
      return h('div', {
        class: 'slider__pointer',
        ref: 'pointerRef',
        style: this.pointerStyle,
      });
    },
  },
  render() {
    return h(
      'div',
      {
        class: 'slider__wrapper',
        style: this.sizeStyle,
      },
      this.genSlider()
    );
  },
});
