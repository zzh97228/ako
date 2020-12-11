import vue, { defineComponent, h, PropType } from 'vue';
import { useGridConsumer, FLEX_KEYS } from '../composables';
import { FlexEnum } from '../services';

export type GridBreakpointsProps = { [props: string]: any } & {
  [T in FlexEnum]: PropType<string | number>;
};
export default defineComponent({
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
    const grid = useGridConsumer();
    return {
      styles: grid.style,
    };
  },
  methods: {},
  computed: {
    breakpointsClasses(): Record<string, any> {
      const obj: Record<string, any> = {};
      let val: string | number | undefined, bk: FlexEnum;
      for (let i = 0; i < FLEX_KEYS.length; i++) {
        bk = FLEX_KEYS[i] as FlexEnum;
        val = this[bk];
        if (val) {
          obj[`col-${val}-${bk}`] = !!val;
        }
      }
      return obj;
    },
    classes(): Record<string, any> {
      return {
        col: true,
        'col--shrink': this.shrink,
        'col--grow': this.grow,
        [`col-${this.cols}`]: !!this.cols,
        ...this.breakpointsClasses,
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
