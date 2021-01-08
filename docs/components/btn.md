# Btn

:tada:
<ac-row gutter="md">
<ac-col>
<ac-btn>button</ac-btn>
</ac-col>
<ac-col>
<ac-btn link color="primary">button</ac-btn>
</ac-col>
<ac-col>
<ac-btn outlined color="primary">button</ac-btn>
</ac-col>
<ac-col>
<ac-btn flat color="primary">button</ac-btn>
</ac-col>
</ac-row>

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
<ac-col><ac-btn small loading="Loading..."></ac-btn><ac-btn loading="Loading..."></ac-btn><ac-btn large loading="Loading..."></ac-btn></ac-col>
<ac-col><ac-btn icon loading>赞</ac-btn></ac-col>
</ac-row>
