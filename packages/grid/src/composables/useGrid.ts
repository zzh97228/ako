import { convertToUnit } from '@lagabu/shared';
import { FlexEnum } from '../services';
import vue, { computed, ExtractPropTypes, Ref, inject, InjectionKey, provide, toRef, ref } from 'vue';

export const FLEX_KEYS: Array<string | FlexEnum> = [FlexEnum.xs, FlexEnum.sm, FlexEnum.md, FlexEnum.lg, FlexEnum.xl];
export const GridSymbol: InjectionKey<{
  gutter: Ref<string | null>;
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
      [`row--gutter-${props.gutter}${props.column ? '-column' : ''}`]: !!props.gutter,
    };
  });
  const styles = computed(() => {
    const style: Record<string, string> = {};
    if (!props.gutter || FLEX_KEYS.includes(props.gutter)) return style;
    let value = convertToUnit(props.gutter) || '0px';
    if (!value.match(/^\-/)) {
      value = '-' + value;
    }
    if (!props.column) {
      style['margin-left'] = value;
      style['margin-right'] = value;
    } else {
      style['margin-top'] = value;
      style['margin-bottom'] = value;
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

export function useGridConsumer() {
  const grid = inject(GridSymbol, {
    gutter: ref(null),
    column: ref(false),
  });
  const styles = computed(() => {
    let gutter: string | null = grid.gutter.value;
    if (!gutter || FLEX_KEYS.includes(gutter)) return {};
    gutter = convertToUnit(gutter) || '0px';
    return {
      [`padding-${grid.column.value ? 'top' : 'left'}`]: gutter,
      [`padding-${grid.column.value ? 'bottom' : 'right'}`]: gutter,
    };
  });

  return {
    style: styles,
  };
}
