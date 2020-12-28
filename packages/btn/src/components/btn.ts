import vue, { toRef, VNodeArrayChildren } from 'vue';
import {
  Ripple,
  useColor,
  useElevation,
  genElevationProp,
  genColorProp,
  genToggleProps,
  useToggle,
} from '@lagabu/shared';
import { useGroupConsumer, namespace } from '../composables';
import { computed, defineComponent, h, mergeProps, withDirectives } from 'vue';
export default defineComponent({
  name: 'btn',
  props: {
    tag: {
      type: String,
      default: 'button',
    },
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
    ...genToggleProps('btn--active'),
  },
  setup(props, context) {
    const isTextColor = computed(() => props.outlined || props.link);
    const color = useColor(props, isTextColor);
    const elevation = useElevation(props);
    const { isActive, class: toggleClasses, toggle } = useToggle(props, context);
    const group = useGroupConsumer(props, isActive);
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
      toggleClasses,
      notAllowed,
      onClick: (e: MouseEvent) => {
        if (notAllowed.value) {
          e.preventDefault();
          e.stopImmediatePropagation();
          return;
        }
        toggle(group.onToggle, group.notAllowed);
      },
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
        this.tag,
        mergeProps(
          {
            class: this.classes,
            onClick: this.onClick,
          },
          {
            class: this.colorClasses,
            style: this.colorStyles,
          },
          {
            class: this.elevationClasses,
            style: this.elevationStyles,
          },
          {
            class: this.toggleClasses,
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
