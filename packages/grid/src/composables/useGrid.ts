import { convertToUnit } from '@lagabu/shared';
import { computed, ExtractPropTypes, Ref, inject, InjectionKey, provide, toRef } from 'vue';

export const FLEX_OBJ = {
  xs: true,
  sm: true,
  md: true,
  lg: true
}
export const FLEX_KEYS = Object.keys(FLEX_OBJ);
export const GridSymbol: InjectionKey<{
  gutter: Ref<string>;
  column: Ref<boolean>;
}> = Symbol('Grid');
export const gridProps = {
  gutter: {
    type: String,
    default: null,
  },
  column: Boolean,
};
export function useGridProvider(props: ExtractPropTypes<typeof gridProps>) {
  const classes = computed(() => {
    if (!FLEX_KEYS.includes(props.gutter)) return {};
    return {
      [`row-gutter--${props.gutter}`]: !!props.gutter,
    };
  });
  const styles = computed(() => {
    const style: Record<string, string> = {};
    if (FLEX_KEYS.includes(props.gutter)) return style;
    const value = convertToUnit(props.gutter) || '0px';
    if (!props.column) {
      style['padding-left'] = value;
      style['padding-right'] = value;
    } else {
      style['padding-top'] = value;
      style['padding-bottom'] = value;
    }
    return style;
  });
  provide(GridSymbol, {
    gutter: toRef(props, 'gutter'),
    column: toRef(props, 'column'),
  });

  return {
    class: classes,
    style: styles,
  };
}

export function useGridInjector() {
  const grid = inject(GridSymbol);
  let styles = computed(() => ({}));
  if (!grid) return { style: styles };
  styles = computed(() => {
    let gutter: string = grid.gutter.value;
    if (FLEX_KEYS.includes(gutter)) return {};
    gutter = convertToUnit(gutter) || '0px';
    !gutter.match(/^(\-)/) && (gutter = '-' + gutter);
    return {
      [`margin-${grid.column.value ? 'top' : 'left'}`]: gutter,
      [`margin-${grid.column.value ? 'bottom' : 'right'}`]: gutter,
    };
  });

  return {
    style: styles,
  };
}
