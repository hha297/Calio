import type { ImageSourcePropType } from 'react-native';

import type { MealType } from '@/features/food/types';

export const MEAL_IMAGES: Record<MealType, ImageSourcePropType> = {
  breakfast: require('../../../assets/images/food/breakfast.png'),
  lunch: require('../../../assets/images/food/lunch.png'),
  dinner: require('../../../assets/images/food/dinner.png'),
  snacks: require('../../../assets/images/food/dessert.png'),
};
