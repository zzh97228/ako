# Grid

Grids components provide flexable layout to display infomation.

## Single Package Usage

You can use components of this package alone.

1. Install

```bash
yarn add @lagabu/grid -D

# or

npm install @lagabu/grid --save-dev
```

2. Use plugin

```js
import { createApp } from 'vue';
import { GridPlugin } from '@lagabu/grid';
import '@lagabu/theme-default/dist/all.min.css';

createApp()
  .use(GridPlugin, {
    prefix: 'ac-', // custom component prefix
    grid: {
      columns: 12, // custom columns number
      gutters: {
        // custom gutter object
        xs: '2px',
        sm: '4px',
      },
    },
  })
  .mount('#app');
```

## Grid Service

Grid service can set global `columns` and `gutters` style options.

GridOptions:

```ts
const enum FlexEnum {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
}

type GridOptions = {
  columns?: string | number;
  gutters?: { [prop: string]: string | number } & {
    [T in FlexEnum]?: string | number;
  };
};
```

## Container

`<container>` component is a simple container

### Props

| Name      | Type               | Default | Description                                |
| :-------- | :----------------- | :------ | :----------------------------------------- |
| tag       | String             | div     | element tag                                |
| fluid     | Boolean            | -       | expand container and set margin to be zero |
| height    | \[String, Number\] | -       | element height style                       |
| width     | \[String, Number\] | -       | element width style                        |
| maxHeight | \[String, Number\] | -       | element max-height style                   |
| minHeight | \[String, Number\] | -       | element min-height style                   |
| maxWidth  | \[String, Number\] | -       | element max-width style                    |
| minWidth  | \[String, Number\] | -       | element min-width style                    |

## Row

`<row>` is a simple flexable row component

### Props

| Name          | Type               | Default | Description                                                                                 |
| :------------ | :----------------- | :------ | :------------------------------------------------------------------------------------------ |
| gutter        | String             | -       | set inner `<col>` component gutter size                                                     |
| column        | Boolean            | -       | set column class                                                                            |
| columnReverse | Boolean            | -       | set column reverse                                                                          |
| justify       | String             | null    | justify-content classes. `start`, `center`, `end`, `space-around`, `space-between` can set. |
| align         | String             | null    | align-items classes. `start`, `center`, `end`, `stretch`, `base-line` can set.              |
| height        | \[String, Number\] | -       | element height style                                                                        |
| width         | \[String, Number\] | -       | element width style                                                                         |
| maxHeight     | \[String, Number\] | -       | element max-height style                                                                    |
| minHeight     | \[String, Number\] | -       | element min-height style                                                                    |
| maxWidth      | \[String, Number\] | -       | element max-width style                                                                     |
| minWidth      | \[String, Number\] | -       | element min-width style                                                                     |

## Col

`<col>` component is a column item container.

### Props

| Name   | Type               | Default | Description                                                      |
| :----- | :----------------- | :------ | :--------------------------------------------------------------- |
| cols   | \[String, Number\] | -       | column width property. 1-12 number can be set                    |
| order  | \[String, Number\] | -       | order style property. columns number, `first`, `last` can be set |
| shrink | Boolean            | -       | add flex-shrink classes                                          |
| grow   | Boolean            | -       | add flex-grow classes                                            |
| xs     | \[String, Number\] | -       | `xs` breakpoint flex-basis percent, 1-12 number can be set       |
| sm     | \[String, Number\] | -       | `sm` breakpoint flex-basis percent, 1-12 number can be set       |
| md     | \[String, Number\] | -       | `md` breakpoint flex-basis percent, 1-12 number can be set       |
| lg     | \[String, Number\] | -       | `lg` breakpoint flex-basis percent, 1-12 number can be set       |
| xl     | \[String, Number\] | -       | `xl` breakpoint flex-basis percent, 1-12 number can be set       |

## Divider

`<divider>` component is a line-style element.

### Props

| Name     | Type    | Default | Description            |
| :------- | :------ | :------ | :--------------------- |
| vertical | Boolean | -       | vertical style divider |
