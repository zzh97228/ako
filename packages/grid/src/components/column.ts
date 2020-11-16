import { convertToNumber, defaultBreakpoints } from '@lagabu/shared';
import { defineComponent, h, mergeProps, PropType } from 'vue';
import { useGridInjector, FLEX_KEYS } from '../composables';

export type GridBreakpointsProps = { [props: string]: any } & {
  [T in keyof typeof defaultBreakpoints]: PropType<string | number>;
};
export const Column = defineComponent({
  name: 'column',
  props: {
    cols: [String, Number],
    ...FLEX_KEYS.reduce((prev, next) => {
      prev[next] = [String, Number];
      return prev;
    }, {} as GridBreakpointsProps),
    shrink: Boolean,
    grow: Boolean,
  },
  setup() {
    const grid = useGridInjector();
    return {
      styles: grid.style,
    };
  },
  methods: {
    getBreakpointsClasses(): Record<string, any> {
      const $breakpoints = this.$ako?.$breakpoints;
      if (!$breakpoints) return {};
      let size: undefined | number | string = undefined;
      // TODO This breakpoints is too heavy. Need to rewrite
      if ($breakpoints.xl) {
        size = this.xl ? this.xl : this.lg || this.md || this.sm || this.xs;
      } else if ($breakpoints.lg) {
        size = this.lg ? this.lg : this.md || this.sm || this.xs;
      } else if ($breakpoints.md) {
        size = this.md ? this.md : this.sm || this.xs;
      } else if ($breakpoints.sm) {
        size = this.sm ? this.sm : this.xs;
      } else if ($breakpoints.xs) {
        size = this.xs;
      }
      size = convertToNumber(size);
      return {
        [`col-${size}`]: !!size,
      };
    },
  },
  computed: {
    classes(): Record<string, any> {
      return {
        col: true,
        'col--shrink': this.shrink,
        'col--grow': this.grow,
        [`col-${this.cols}`]: !!this.cols,
        ...this.getBreakpointsClasses(),
      };
    },
  },
  render() {
    return h(
      'div',
      {
        class: this.classes,
        style: this.styles,
      },
      this.$slots.default && this.$slots.default()
    );
  },
});
