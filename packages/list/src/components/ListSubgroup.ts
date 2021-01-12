import { genColorProp, genToggleProps, useExpandTransition, useColor, useToggle } from '@lagabu/shared';
import vue, { defineComponent, h, mergeProps, reactive, toRef, Transition, VNode, vShow, withDirectives } from 'vue';

export default defineComponent({
  name: 'list-subgroup',
  props: {
    disabled: Boolean,
    showOnAppear: Boolean,
    ...genToggleProps('list-subgroup--active', true),
    ...genColorProp('primary'),
  },
  setup(props, context) {
    const { slots } = context;
    const notAllowed = toRef(props, 'disabled');
    const transitionProps = useExpandTransition();
    const { class: colorClasses, style: colorStyles } = useColor(props, true);
    const { toggle, class: toggleClasses, isActive } = useToggle(props, context, notAllowed);

    if (props.showOnAppear && !notAllowed.value) {
      isActive.value = true;
    }

    function onClickActivator(e: Event) {
      if (props.disabled) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      toggle();
    }

    function genActivator() {
      return h(
        'div',
        {
          class: 'list-subgroup__activator',
          onClick: onClickActivator,
        },
        slots.activator &&
          slots.activator({
            isActive,
          })
      );
    }

    function genContent() {
      return withDirectives(
        h(
          'ul',
          {
            class: 'list-subgroup__content',
          },
          slots.default && slots.default()
        ),
        [[vShow, isActive.value]]
      );
    }

    function genTransition() {
      return h(Transition, transitionProps, {
        default: () => genContent(),
      });
    }

    return () =>
      h(
        'li',
        mergeProps(
          {
            class: {
              'list-subgroup': true,
              'list-subgroup--disabled': props.disabled,
              ...toggleClasses.value,
            },
          },
          {
            class: colorClasses.value,
            style: colorStyles.value,
          }
        ),
        [genActivator(), genTransition()]
      );
  },
});
