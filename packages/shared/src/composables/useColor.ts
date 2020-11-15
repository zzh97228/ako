import { ExtractPropTypes } from 'vue';

// TODO Color
export const colorProps = {
  color: String,
};

export function useColor(props: ExtractPropTypes<typeof colorProps>) {
  return {};
}
