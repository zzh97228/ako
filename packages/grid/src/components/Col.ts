import { convertToNumber, isNumber, isString } from '@lagabu/shared';
import vue, { computed, defineComponent, h, mergeProps, PropType } from 'vue';
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
    order: [String, Number],
  },
  setup(props) {
    const grid = useGridConsumer();

    const orderClasses = computed(() => {
      let orderNumber: number | string;
      if (isString(props.order) && ['first', 'last'].includes(props.order.toLowerCase())) {
        orderNumber = props.order;
      } else if ((orderNumber = convertToNumber(props.order)) < 0) {
        orderNumber = 'first';
      }
      return {
        [`col--order-${orderNumber}`]: orderNumber === 'first' || (isNumber(orderNumber) && !isNaN(orderNumber)),
      };
    });
    return {
      styles: grid.style,
      orderClasses,
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
      };
    },
  },
  render() {
    return h(
      'div',
      mergeProps(
        {
          class: this.classes,
          style: this.styles,
        },
        {
          class: this.orderClasses,
        },
        {
          class: this.breakpointsClasses,
        }
      ),

      this.$slots.default && this.$slots.default()
    );
  },
});
