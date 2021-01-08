# Shared

This package contains global tool functions.

## Services

Service for generating global css variables, tool classes and vue global properties.

### ColorService

Service for customizing color css variables.

```ts
type ColorProps = {
  color?: {
    theme?: {
      primary?: string;
      success?: string;
      warning?: string;
      error?: string;
    };
    basic?: {
      'red-0'?: string;
      'red-1'?: string;
      'red-2'?: string;
      'red-3'?: string;
      'red-4'?: string;
      'red-5'?: string;
      'red-6'?: string;
      'red-7'?: string;
      'red-8'?: string;
      'red-9'?: string;
      'blue-0'?: string;
      'blue-1'?: string;
      'blue-2'?: string;
      'blue-3'?: string;
      'blue-4'?: string;
      'blue-5'?: string;
      'blue-6'?: string;
      'blue-7'?: string;
      'blue-8'?: string;
      'blue-9'?: string;
      'green-0'?: string;
      'green-1'?: string;
      'green-2'?: string;
      'green-3'?: string;
      'green-4'?: string;
      'green-5'?: string;
      'green-6'?: string;
      'green-7'?: string;
      'green-8'?: string;
      'green-9'?: string;
      'yellow-0'?: string;
      'yellow-1'?: string;
      'yellow-2'?: string;
      'yellow-3'?: string;
      'yellow-4'?: string;
      'yellow-5'?: string;
      'yellow-6'?: string;
      'yellow-7'?: string;
      'yellow-8'?: string;
      'yellow-9'?: string;
    };
  };
};
```

### ElevatioService

Service for customizing shadow style.

```ts
type ElevationProps = {
  elevation?: {
    xs?: string;
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
};
```

## Directives

Global directives.

### `v-ripple`

`v-ripple` is used to add ripple-style click effect.

## Composables

Composable functions follow composition-api rfc. It is a set of additive, function-based APIs that allow flexible composition of component logic.

### useColor

`useColor` generate color classes and styles with `color` propperty. eg: `primary-color` or `primary-color--text`.

```ts
import { h, defineComponent } from 'vue';
import { genColorProp, useColor } from '@lagabu/shared';

export default defineComponent({
  props: {
    /**
     * color: {
     *   type: String,
     *   default: 'primary'
     * }
     */
    ...genColorProp('primary'),
  },
  setup(props) {
    const { class: colorClasses, style: colorStyles } = useColor(props);
    return () => h('div', { class: colorClasses.value, style: colorStyles.value });
  },
});
```

### useSize

`useSize` function generate size styles with `width`, `height`, `minHeight`, `minWidth`, `maxWidth`, `maxHeight` property.

```ts
import { h, defineComponent } from 'vue';
import { sizeProps, useSize } from '@lagabu/shared';

export default defineComponent({
  props: {
    /**
     * width: [String, Number],
     * height: [String, Number],
     * maxHeight: [String, Number],
     * maxWidth: [String, Number],
     * minHeight: [String, Number],
     * minWidth: [String, Number],
     */
    ...sizeProps,
  },
  setup(props) {
    const { sizeStyle } = useSize(props);
    return () => h('div', { style: sizeStyle.value });
  },
});
```
