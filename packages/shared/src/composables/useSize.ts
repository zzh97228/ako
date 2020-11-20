import { computed, ExtractPropTypes, PropType } from 'vue';
import { convertToUnit } from '../utils/helpers';

export const sizeProps = {
  width: [String, Number],
  height: [String, Number],
  maxHeight: [String, Number],
  maxWidth: [String, Number],
  minHeight: [String, Number],
  minWidth: [String, Number],
};
export function useSize(props: ExtractPropTypes<typeof sizeProps>) {
  return {
    sizeStyle: computed(() => {
      const obj: Record<string, any> = {};
      if (props.width) obj['width'] = convertToUnit(props.width);
      if (props.height) obj['height'] = convertToUnit(props.height);
      if (props.maxHeight) obj['maxHeight'] = convertToUnit(props.maxHeight);
      if (props.maxWidth) obj['maxWidth'] = convertToUnit(props.maxWidth);
      if (props.minHeight) obj['minHeight'] = convertToUnit(props.minHeight);
      if (props.minWidth) obj['minWidth'] = convertToUnit(props.minWidth);
      return obj;
    }),
  };
}
