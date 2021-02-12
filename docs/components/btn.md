# btn

:tada:

<ako-row gutter="md"><ako-col><ako-btn>button</ako-btn></ako-col><ako-col><ako-btn link color="primary">button</ako-btn></ako-col><ako-col><ako-btn outlined color="primary">button</ako-btn></ako-col><ako-col><ako-btn flat color="primary">button</ako-btn></ako-col></ako-row>

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

<ako-row column gutter="xs"><ako-col><ako-btn small loading="Loading..."></ako-btn><ako-btn loading="Loading..."></ako-btn><ako-btn large loading="Loading..."></ako-btn></ako-col><ako-col><ako-btn icon loading>赞</ako-btn></ako-col></ako-row>
