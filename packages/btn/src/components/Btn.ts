import vue, { VNodeArrayChildren } from 'vue';
import {
  Ripple,
  useColor,
  useElevation,
  genElevationProp,
  genColorProp,
  genToggleProps,
  useToggle,
  isString,
} from '@lagabu/shared';
import { useGroupConsumer } from '../composables';
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
    icon: Boolean,
    loading: [Boolean, String],
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
        'btn--disabled': notAllowed.value,
        'btn--link': props.link,
        'btn--icon': props.icon,
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
    genSpin() {
      return h('div', {
        class: 'btn__spinner',
      });
    },
    genLoading() {
      return h(
        'span',
        {
          class: 'btn__loading',
        },
        isString(this.loading) && this.loading ? this.loading : 'loading...'
      );
    },
    genLoadingSlot() {
      const vnodeArr: VNodeArrayChildren = [this.genSpin()];
      if (!this.icon) {
        vnodeArr.push(this.genLoading());
      }
      return vnodeArr;
    },
    genBtnContent(children: VNodeArrayChildren | undefined) {
      return h(
        'div',
        {
          class: 'btn__content',
        },
        children ? children : this.$slots.default && this.$slots.default()
      );
    },
    genBtn() {
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
        this.genBtnContent(this.loading ? this.genLoadingSlot() : void 0)
      );
    },
  },
  render() {
    return withDirectives(this.genBtn(), [
      [
        Ripple,
        {
          disabled: this.notAllowed,
        },
        this.tile ? 'tile' : '',
      ],
    ]);
  },
});
