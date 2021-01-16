import { ClickOutside, convertToUnit, useExpandTransition, convertToNumber } from '@lagabu/shared';
import vue, {
  computed,
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  reactive,
  readonly,
  ref,
  Teleport,
  TeleportProps,
  Transition,
  vShow,
  watch,
  withDirectives,
} from 'vue';

const PositionList = ['bottom', 'top', 'left', 'right'];
export default defineComponent({
  name: 'dropdown',
  props: {
    disabled: Boolean,
    showOnAppear: Boolean,
    position: {
      type: String,
      default: 'bottom',
      validator: (str: any) => PositionList.includes(str),
    },
    paddingSize: {
      type: [String, Number],
      default: 4,
    },
    justify: {
      type: String,
      default: 'start',
      validator: (str: any) => ['start', 'end'].includes(str),
    },
  },
  setup(props, context) {
    const isActive = ref(props.disabled ? false : Boolean(props.showOnAppear));
    const notAllowed = computed(() => props.disabled || !isActive.value);
    const transitionProps = useExpandTransition();
    const activatorRef = ref<null | HTMLElement>(null);
    const contentRef = ref<null | HTMLElement>(null);
    const state = reactive({
      left: '0px',
      top: '0px',
      minWidth: '0px',
      cWidth: 0,
      cHeight: 0,
    });

    function calculatePosition() {
      let aElm: HTMLElement | null, cElm: HTMLElement | null;
      if (!(aElm = activatorRef.value) || !(cElm = contentRef.value)) return;
      const paddingSize = convertToNumber(props.paddingSize) || 0;
      const { left, top, height, width } = aElm.getBoundingClientRect();
      const [scrollY, scrollX] = [document.documentElement.scrollTop, document.documentElement.scrollLeft];
      let x = 0,
        y = 0,
        sub = state.cWidth - width < 0 ? 0 : state.cWidth - width;

      sub = props.justify === 'left' ? 0 : -sub;
      switch (props.position) {
        case 'left': {
          x = left + scrollX - state.cWidth - paddingSize;
          y = top + scrollY;
          break;
        }
        case 'right': {
          x = left + scrollX + width + paddingSize;
          y = top + scrollY;
          break;
        }
        case 'top': {
          x = left + scrollX + sub;
          y = top + scrollY - state.cHeight - paddingSize;
          break;
        }
        case 'bottom':
        default: {
          x = left + scrollX + sub;
          y = top + scrollY + height + paddingSize;
          break;
        }
      }
      state.left = convertToUnit(x) || '0px';
      state.top = convertToUnit(y) || '0px';
      state.minWidth = convertToUnit(width) || 'auto';
    }

    function initialContentSize() {
      let cElm: HTMLElement | null;
      if (!(cElm = contentRef.value)) return;
      const storedDisplay = getComputedStyle(cElm).display;
      cElm.style.display = 'block';
      const { width, height } = cElm.getBoundingClientRect();
      state.cWidth = width;
      state.cHeight = height;
      cElm.style.display = storedDisplay;
    }

    function onClickActivator(e: MouseEvent) {
      if (props.disabled) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      isActive.value = !isActive.value;
      calculatePosition();
    }

    function onResize() {
      if (props.disabled || !isActive.value) {
        return;
      }
      calculatePosition();
    }

    const onClickOutside = () => {
      isActive.value = false;
    };

    const activeStop = watch(isActive, (newVal, oldVal) => {
      if (props.disabled || newVal === oldVal || !newVal) return;
      calculatePosition();
    });

    onMounted(() => {
      if (props.disabled) return;
      initialContentSize();
      if (isActive.value) {
        calculatePosition();
      }
      window.addEventListener('resize', onResize, false);
    });
    onBeforeUnmount(() => {
      window.removeEventListener('resize', onResize, false);
      activeStop();
    });

    return {
      onClickActivator,
      activatorRef,
      contentRef,
      isActive: readonly(isActive),
      state: readonly(state),
      transitionProps,
      clickOutsideValue: {
        disabled: notAllowed,
        callback: onClickOutside,
        include: () => [contentRef.value],
      },
    };
  },
  methods: {
    genActivator() {
      return withDirectives(
        h(
          'div',
          {
            class: {
              dropdown__activator: true,
              'dropdown__activator--active': this.isActive,
            },
            onClick: this.onClickActivator,
            ref: 'activatorRef',
          },
          this.$slots.activator &&
            this.$slots.activator({
              disabled: this.disabled,
              isActive: this.isActive,
            })
        ),
        [[ClickOutside, this.clickOutsideValue]]
      );
    },
    genContent() {
      return withDirectives(
        h(
          'div',
          {
            ref: 'contentRef',
            class: 'dropdown__content',
            style: {
              position: 'absolute',
              left: this.state.left,
              top: this.state.top,
              minWidth: this.state.minWidth,
            },
          },
          this.$slots.default && this.$slots.default()
        ),
        [[vShow, this.isActive]]
      );
    },
    genTeleport() {
      return h(
        Teleport as any,
        {
          to: 'body',
        } as TeleportProps,

        [
          h(Transition, this.transitionProps, {
            default: () => this.genContent(),
          }),
        ]
      );
    },
  },
  render() {
    return h(
      'div',
      {
        class: 'dropdown__wrapper',
      },
      [this.genActivator(), this.genTeleport()]
    );
  },
});
