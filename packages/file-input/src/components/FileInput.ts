import { defineComponent, h, PropType, ref } from 'vue';
import { convertToNumber, isArray, isNumber, isString, isUndefined, useModel } from '@lagabu/shared';
function b2kb(size: number): number {
  return size / (1 << 10);
}

function normalizeSize(size: number | string): number {
  let num: number = 0;
  if (isNumber(size)) {
    num = size;
  } else if (isString(size) && size.match(/(\d*\.?\d+)(b|kb?|mb?|gb?)/i)) {
    num = convertToNumber(RegExp.$1);
    const innerUnit = RegExp.$2.toLowerCase();
    switch (innerUnit) {
      case 'b': {
        num /= 1 << 10;
        break;
      }
      case 'm':
      case 'mb': {
        num *= 1 << 10;
        break;
      }
      case 'g':
      case 'gb': {
        num *= 1 << 20;
        break;
      }
      case 'k':
      case 'kb':
      default: {
        break;
      }
    }
  }

  return num;
}

export default defineComponent({
  name: 'FileInput',
  props: {
    modelValue: {
      type: [Object, Array] as PropType<File | Array<File>>,
      default: undefined,
      validator: (val: any) => {
        if (val instanceof File) return true;
        if (isArray(val)) {
          for (let key in val) {
            if (!(val[key] instanceof File)) return false;
          }
          return true;
        }
        return false;
      },
    },
    disabled: Boolean,
    multiple: Boolean,
    accept: {
      type: String,
      default: '*/*',
    },
    maxSize: [String, Number],
  },
  setup(props, context) {
    const inputRef = ref<null | HTMLInputElement>(null);
    const { lazyState, model, setInnerState } = useModel(props, context);

    function isSizeValidate(file: File): boolean {
      if (!props.maxSize) return true;
      const maxSize = normalizeSize(props.maxSize),
        size = b2kb(file.size);
      return size < maxSize;
    }

    function normalize(val: File | File[] | undefined) {
      if (isUndefined(val)) {
        return props.multiple ? [] : undefined;
      } else if (isArray(val)) {
        return props.multiple ? val : val[0];
      } else {
        return props.multiple ? [val] : val;
      }
    }

    const onContentClick = (e: MouseEvent) => {
      if (props.disabled) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      let elm: HTMLInputElement | null;
      if (!(elm = inputRef.value)) return;
      elm.click();
    };

    const onInputChange = (e: InputEvent) => {
      if (props.disabled) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
      const target = e.target as HTMLInputElement;
      const files = target.files;
      if (!files?.length) return;
      const errorArray: File[] = [];
      if (props.multiple) {
        let file: File | null;
        const fileArray: File[] = [];
        for (let i = 0; i < files.length; i++) {
          if (!(file = files.item(i))) continue;
          if (isSizeValidate(file)) {
            fileArray.push(file);
          } else {
            errorArray.push(file);
          }
        }
        model.value = fileArray;
      } else {
        if (isSizeValidate(files[0])) {
          model.value = files[0];
        } else {
          errorArray.push(files[0]);
        }
      }
      if (errorArray.length > 0) {
        context.emit('change:oversize', errorArray);
      }
      // reset input content
      (e.target as any).value = null;
    };

    // normalize modelValue first
    setInnerState(normalize(props.modelValue));

    return {
      onContentClick,
      onInputChange,
      inputRef,
    };
  },
  methods: {
    genInput() {
      return h('input', {
        ref: 'inputRef',
        type: 'file',
        disabled: this.disabled,
        multiple: this.multiple,
        accept: this.accept,
        style: {
          display: 'none',
        },
        onChange: this.onInputChange,
      });
    },
    genContent() {
      return h('div', {
        class: 'file-input',
        onClick: this.onContentClick,
      });
    },
    genActivator() {
      return h(
        'div',
        {
          class: 'file-input__activator',
        },
        this.$slots.activator
          ? this.$slots.activator({
              onClick: this.onContentClick,
            })
          : this.genContent()
      );
    },
  },
  render() {
    return h(
      'div',
      {
        class: 'file-input__wrapper',
      },
      [this.genActivator(), this.genInput()]
    );
  },
});
