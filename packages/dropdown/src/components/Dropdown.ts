import { genColorProp, useColor } from '@lagabu/shared';
import vue, { defineComponent, h, ref } from 'vue';

export default defineComponent({
  name: 'dropdown',
  props: {
    ...genColorProp(),
    disabled: Boolean,
  },
  setup(props, context) {
    const { class: colorClasses, style: colorStyles } = useColor(props);
    const activatorRef = ref<null | HTMLElement>(null);
    function onClickActivator(e: MouseEvent) {
      if (props.disabled) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
    }
    return {
      onClickActivator,
      activatorRef,
    };
  },
  methods: {
    genActivator() {
      return h(
        'div',
        {
          class: 'dropdown__activator',
          onClick: this.onClickActivator,
          ref: 'activatorRef',
        },
        this.$slots.activator &&
          this.$slots.activator({
            disabled: this.disabled,
          })
      );
    },
    genContent() {
      return h(
        'div',
        {
          class: 'dropdown__content',
        },
        this.$slots.default && this.$slots.default()
      );
    },
  },
  render() {
    return h(
      'div',
      {
        class: 'dropdown__wrapper',
      },
      [this.genActivator(), this.genContent()]
    );
  },
});
