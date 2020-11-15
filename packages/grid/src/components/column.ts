import { computed, defineComponent, getCurrentInstance, h, mergeProps, PropType } from 'vue';
import { useGridInjector, FLEX_OBJ, FLEX_KEYS } from '../composables';
import { GridType } from '../services';
export type GridBreakpointsProps = { [props: string]: any } & {
  [T in keyof typeof FLEX_OBJ]: PropType<string | number>;
};
export const Column = defineComponent({
  name: 'column',
  props: {
    cols: {
      type: [String, Boolean],
      default: undefined,
    },
    ...FLEX_KEYS.reduce((prev, next) => {
      prev[next] = [String, Number];
      return prev;
    }, {} as GridBreakpointsProps),
  },
  setup() {
    const grid = useGridInjector();
    return {
      grid,
    };
  },
  computed: {
    styles() {
      const $grid = this.$ako?.$grid;
      if (!$grid) return;
      const columns = $grid.columns;
      return {};
    },
  },
  render() {
    return h(
      'div',
      mergeProps(
        {
          class: 'column',
        },
        {
          style: this.grid.style,
        }
      ),
      this.$slots.default && this.$slots.default()
    );
  },
});
