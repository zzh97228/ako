import { Ripple, useColor, useElevation, genElevationProp, genColorProp } from '@lagabu/shared';
import { computed, defineComponent, h, mergeProps, withDirectives } from 'vue';
export const Btn = defineComponent({
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
    fab: Boolean,
    link: Boolean,
    ...genColorProp(),
    ...genElevationProp(),
  },
  setup(props, { slots }) {
    const isTextColor = computed(() => props.outlined);
    const color = useColor(props, isTextColor);
    const elevation = useElevation(props);
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
        'btn--fab': props.fab,
        'btn--link': props.link,
      };
    });
    return {
      classes,
      colorClasses: color.class,
      colorStyles: color.style,
      elevationClasses: elevation.class,
      elevationStyles: elevation.style,
    };
  },
  methods: {
    button() {
      return h(
        'button',
        mergeProps(
          {
            class: this.classes,
            'aria-disabled': !!this.disabled || undefined,
            onClick: (e: MouseEvent) => {
              if (this.disabled) {
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
        h(
          'div',
          {
            class: 'btn__content',
          },
          this.$slots.default && this.$slots.default()
        )
      );
    },
  },
  render() {
    return withDirectives(this.button(), [[Ripple]]);
  },
});
