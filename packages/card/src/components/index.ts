import { FunctionalComponent } from 'vue';
import { genFunctionalComponent } from '@lagabu/shared';
import Card from './Card';
/**
 * @public card
 */
export { Card };
type CustomFunctionalProps = FunctionalComponent<{ tag: string }>;
/**
 * @public card-title
 */
export const CardTitle: CustomFunctionalProps = genFunctionalComponent('CardTitle');
/**
 * @public card-subtitle
 */
export const CardSubtitle: CustomFunctionalProps = genFunctionalComponent('CardSubtitle');
/**
 * @public cawrd-actions
 */
export const CardActions: CustomFunctionalProps = genFunctionalComponent('CardActions');
/**
 * @public card-content
 */
export const CardContent: CustomFunctionalProps = genFunctionalComponent('CardContent');
