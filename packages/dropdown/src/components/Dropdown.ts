import { genColorProp, hasWindow, useColor } from '@lagabu/shared';
import vue, { defineComponent, h, reactive, Ref, ref } from 'vue';

type ElementOrNull = Ref<null | HTMLElement>;
function calculatePosition(activatorRef: ElementOrNull, contentRef: ElementOrNull) {
  let aElm: HTMLElement | null, cElm: HTMLElement | null;
  if (!(aElm = activatorRef.value) || !(cElm = contentRef.value)) return;
  const { left, top } = aElm.getBoundingClientRect();
  const [] = [document.documentElement.scrollTop, document.documentElement.scrollLeft];
}

export default defineComponent({
  name: 'dropdown',
  props: {
    ...genColorProp(),
    disabled: Boolean,
  },
  setup(props, context) {
    const { class: colorClasses, style: colorStyles } = useColor(props);
    const activatorRef = ref<null | HTMLElement>(null);
    const contentRef = ref<null | HTMLElement>(null);

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
