import { FunctionalComponent } from 'vue';
import { genFunctionalComponent } from '@lagabu/shared';
import Card from './Card';
export { Card };
type CustomFunctionalProps = FunctionalComponent<{ tag: string }>;
export const CardTitle: CustomFunctionalProps = genFunctionalComponent('CardTitle');
export const CardSubtitle: CustomFunctionalProps = genFunctionalComponent('CardSubtitle');
export const CardActions: CustomFunctionalProps = genFunctionalComponent('CardActions');
export const CardContent: CustomFunctionalProps = genFunctionalComponent('CardContent');
