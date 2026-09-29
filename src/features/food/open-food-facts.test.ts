import { describe, expect, it } from 'vitest';

import { normalizeOpenFoodFactsProduct } from './open-food-facts';

describe('normalizeOpenFoodFactsProduct', () => {
  it('maps a complete product', () => {
    const food = normalizeOpenFoodFactsProduct({
      product_name: 'Greek Yogurt',
      brands: 'Example',
      code: '123',
      serving_size: '150 g',
      nutriments: {
        'energy-kcal_serving': 120,
        proteins_serving: 15,
        carbohydrates_serving: 8,
        fat_serving: 3,
      },
    });

    expect(food).toEqual({
      name: 'Greek Yogurt',
      brand: 'Example',
      barcode: '123',
      servingLabel: '150 g',
      servingGrams: null,
      calories: 120,
      proteinG: 15,
      carbsG: 8,
      fatG: 3,
      imageUrl: null,
      source: 'open_food_facts',
    });
  });

  it('returns null without a name', () => {
    expect(normalizeOpenFoodFactsProduct({ code: '1' })).toBeNull();
  });

  it('tolerates missing nutriments', () => {
    const food = normalizeOpenFoodFactsProduct({ product_name: 'Mystery Bar' });
    expect(food?.calories).toBe(0);
    expect(food?.servingLabel).toBe('100 g');
  });
});
