import { useSize, sizeProps } from '@lagabu/shared';
import vue, { computed, defineComponent, h, mergeProps } from 'vue';
import { useGridProvider, gridProps } from '../composables';
const BASE_PARAMS = ['center', 'start', 'end'];
export const JUSTIFY_PARAMS = [...BASE_PARAMS, 'space-around', 'space-between'];
export const ALIGN_PARAMS = [...BASE_PARAMS, 'stretch', 'baseline'];
export default defineComponent({
  name: 'row',
  props: {
    ...gridProps,
    ...sizeProps,
    columnReverse: Boolean,
    justify: {
      type: String,
      default: null,
      validator: (str: any) => {
        return JUSTIFY_PARAMS.includes(str);
      },
    },
    align: {
      type: String,
      default: null,
      validator: (str: any) => {
        return ALIGN_PARAMS.includes(str);
      },
    },
  },
  setup(props, { slots }) {
    const grid = useGridProvider(props);
    const { sizeStyle } = useSize(props);
    const classes = computed(() => {
      return {
        row: true,
        [`row--column`]: !!props.column,
        [`row--column-reverse`]: !!props.columnReverse,
        [`row--justify-content-${props.justify}`]: !!props.justify,
        [`row--align-items-${props.align}`]: !!props.align,
      };
    });
    return () =>
      h(
        'div',
        mergeProps(
          {
            class: classes.value,
            style: sizeStyle.value,
          },
          {
            class: grid.class.value,
            style: grid.style.value,
          }
        ),
        slots.default && slots.default()
      );
  },
});
