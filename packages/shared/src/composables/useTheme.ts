import { computed, ExtractPropTypes, inject, InjectionKey, provide, ref, Ref, toRef } from 'vue';
import { isUndefined } from '../utils/helpers';

export function genThemeProps() {
  return {
    dark: Boolean,
  };
}
export type ThemeProps = ExtractPropTypes<ReturnType<typeof genThemeProps>>;
export const ThemeSymbol: InjectionKey<{
  isDark: Ref<boolean>;
}> = Symbol('Theme');

export function useThemeProvider(props: ThemeProps) {
  const isDark = toRef(props, 'dark');
  provide(ThemeSymbol, {
    isDark,
  });
  return {
    isDark,
  };
}

export function useThemeConsumer(props: ThemeProps) {
  const provider = inject(ThemeSymbol, {
    isDark: ref(false),
  });
  const isDark = computed(() => {
    if (!isUndefined(props.dark)) return props.dark;
    return provider.isDark.value;
  });
  return {
    isDark,
  };
}
