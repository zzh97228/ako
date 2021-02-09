import { genPercentProps, usePercent, useSize, sizeProps, hasDocument, genColorProp, useColor } from '@lagabu/shared';
import vue, { computed, defineComponent, h, reactive, ref } from 'vue';

export default defineComponent({
  name: 'slider',
  props: {
    ...genPercentProps(),
    ...sizeProps,
    ...genColorProp('primary'),
    vertical: Boolean,
    reverse: Boolean,
    tile: Boolean,
  },
  setup(props, context) {
    const { percent } = usePercent(props),
      { sizeStyle } = useSize(props),
      { class: colorClasses, style: colorStyles } = useColor(props, true),
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
      let v = props.vertical ? height - (y - y1) : x - x1;
      if (props.reverse) {
        v = props.vertical ? height - v : width - v;
      }
      v = props.vertical ? v / height : v / width;
      return v;
    }

    function onPointerdown(e: PointerEvent) {
      if (!hasDocument()) return;
      document.documentElement.addEventListener('pointermove', onPointermove, false);
      document.documentElement.addEventListener('pointerup', onPointerup, false);
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
      state.frameId = setTimeout(() => {
        let slider: HTMLElement | null;
        if (!(slider = sliderRef.value)) return;
        const p = getPercent(slider, e);
        if (p !== percent.value) {
          percent.value = p;
        }
        state.frameId = 0;
      }, 0);
    }
    function onPointerup(e: Event) {
      if (!hasDocument() || props.disabled) return;
      document.documentElement.removeEventListener('pointermove', onPointermove, false);
      document.documentElement.removeEventListener('pointerup', onPointerup, false);
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
      colorClasses,
      colorStyles,
    };
  },
  methods: {
    genSlider() {
      return h(
        'div',
        {
          class: {
            slider: true,
            'slider--reverse': this.reverse,
            'slider--tile': this.tile,
            'slider--disabled': this.disabled,
            ...this.colorClasses,
          },
          style: this.colorStyles,
          ref: 'sliderRef',
          onMousedown: this.onPointerdown,
        },
        [this.genPointer(), this.genBackground()]
      );
    },
    genBackground() {
      return h('div', {
        class: 'slider__background',
        style: this.backStyle,
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
        class: {
          ['slider__wrapper']: true,
          'slider--vertical': this.vertical,
        },
        style: this.sizeStyle,
      },
      this.genSlider()
    );
  },
});
