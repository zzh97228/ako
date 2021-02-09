import { genColorProp, genToggleProps, useColor, useToggle } from '@lagabu/shared';
import vue, { defineComponent, h, mergeProps, toRef, createSlots, Slot } from 'vue';

export default defineComponent({
  name: 'list-item',
  props: {
    ...genToggleProps('list-item--active', true),
    ...genColorProp('primary'),
    disabled: Boolean,
  },
  setup(props, context) {
    const { slots } = context;
    const notAllowed = toRef(props, 'disabled');
    const { class: colorClasses, style: colorStyles } = useColor(props, true);
    const { class: toggleClasses, toggle, isActive } = useToggle(props, notAllowed);
    function onClick(e: Event) {
      if (props.disabled) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      toggle();
    }
    function createAddon(addonName: string) {
      if (!slots[addonName]) return;
      return h(
        'div',
        {
          class: `list-item__${addonName}`,
        },
        (slots[addonName] as Slot)({
          isActive,
        })
      );
    }
    function genContent() {
      return h(
        'div',
        {
          class: 'list-item__content',
        },
        slots.default && slots.default()
      );
    }
    return () =>
      h(
        'li',
        mergeProps(
          {
            class: {
              'list-item': true,
              'list-item--disabled': notAllowed.value,
            },
            onClick,
          },
          {
            class: toggleClasses.value,
          },
          {
            class: colorClasses.value,
            style: colorStyles.value,
          }
        ),
        [createAddon('prefix'), genContent(), createAddon('suffix')]
      );
  },
});
