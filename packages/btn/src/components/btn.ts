import vue, { VNodeArrayChildren } from 'vue';
import { Ripple, useColor, useElevation, genElevationProp, genColorProp } from '@lagabu/shared';
import { computed, defineComponent, h, mergeProps, withDirectives } from 'vue';
export default defineComponent({
  name: 'btn',
  props: {
    outlined: Boolean,
    flat: Boolean,
    tile: Boolean,
    small: Boolean,
    large: Boolean,
    block: Boolean,
    round: Boolean,
    disabled: Boolean,
    link: Boolean,
    loading: Boolean, // TODO loading style
    ...genColorProp(),
    ...genElevationProp(),
  },
  setup(props, { slots }) {
    const isTextColor = computed(() => props.outlined || props.link);
    const color = useColor(props, isTextColor);
    const elevation = useElevation(props);
    const notAllowed = computed(() => props.loading || props.disabled);
    const classes = computed(() => {
      return {
        btn: true,
        'btn--small': props.small,
        'btn--large': props.large,
        'btn--tile': props.tile,
        'btn--flat': props.flat,
        'btn--outlined': props.outlined,
        'btn--block': props.block,
        'btn--round': props.round,
        'btn--disabled': props.disabled,
        'btn--link': props.link,
      };
    });
    return {
      classes,
      colorClasses: color.class,
      colorStyles: color.style,
      elevationClasses: elevation.class,
      elevationStyles: elevation.style,
      notAllowed,
    };
  },
  methods: {
    genLoadingSlot(children?: VNodeArrayChildren) {
      return h(
        'div',
        {
          class: 'btn__loading',
        },
        children
      );
    },
    genBtnContent() {
      return h(
        'div',
        {
          class: 'btn__content',
        },
        this.$slots.default && this.$slots.default()
      );
    },
    genBtn() {
      const children: VNodeArrayChildren = [];
      if (this.loading) {
        children.push(this.genLoadingSlot(this.$slots.loading && this.$slots.loading()));
      } else {
        children.push(this.genBtnContent());
      }
      return h(
        'button',
        mergeProps(
          {
            class: this.classes,
            'aria-disabled': !!this.disabled || undefined,
            onClick: (e: MouseEvent) => {
              if (this.notAllowed) {
                e.stopImmediatePropagation();
                return;
              }
            },
          },
          {
            class: this.colorClasses,
            style: this.colorStyles,
          },
          {
            class: this.elevationClasses,
            style: this.elevationStyles,
          }
        ),
        children
      );
    },
  },
  render() {
    return withDirectives(this.genBtn(), [[Ripple]]);
  },
});
