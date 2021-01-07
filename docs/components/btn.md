# Btn

:tada:

<ac-btn>button</ac-btn>

<ac-btn link>button</ac-btn>

<ac-btn color="primary" outlined>button</ac-btn>

<ac-btn color="primary" flat>button</ac-btn>

<ac-btn tile>button</ac-btn>

### Props

---

| Name        | Type                | Default     | Description                               |
| :---------- | :------------------ | :---------- | :---------------------------------------- |
| tag         | String              | button      | element tag                               |
| outliend    | Boolean             | -           | outlined style                            |
| flat        | Boolean             | -           | flat style                                |
| tile        | Boolean             | -           | square style                              |
| link        | Boolean             | -           | link style                                |
| small       | Boolean             | -           | small style                               |
| large       | Boolean             | -           | large style                               |
| block       | Boolean             | -           | display block and width 100%              |
| round       | Boolean             | -           | round style                               |
| disabled    | Boolean             | -           | disabled to click                         |
| icon        | Boolean             | -           | limit width and height to be equal        |
| loading     | \[Boolean, String\] | -           | loading type button and disabled to click |
| color       | String              | primary     | change current color class or style       |
| elevation   | String              | -           | change current shadow class or style      |
| toggleable  | Boolean             | -           | set this element whether to be toggleable |
| active      | Boolean             | -           | control inside active `ref` from outside  |
| activeClass | String              | btn--active | active class name                         |

### Loading

---

<ac-row column gutter="xs">
<ac-col><ac-btn loading="Loading..."></ac-btn></ac-col>
<ac-col><ac-btn icon loading>赞</ac-btn></ac-col>
</ac-row>
