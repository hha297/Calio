export type CalioFood = {
  name: string;
  brand: string | null;
  barcode: string | null;
  servingLabel: string;
  servingGrams: number | null;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  imageUrl: string | null;
  source: 'open_food_facts' | 'manual';
};

type OffProduct = {
  product_name?: string;
  brands?: string;
  code?: string;
  image_front_small_url?: string;
  image_url?: string;
  nutriments?: Record<string, number | undefined>;
  serving_size?: string;
  quantity?: string;
};

/**
 * Normalize Open Food Facts payloads into Calio's food model.
 * Missing nutrition is allowed; the UI must handle incomplete data.
 */
export function normalizeOpenFoodFactsProduct(product: OffProduct): CalioFood | null {
  const name = product.product_name?.trim();
  if (!name) return null;

  const nutriments = product.nutriments ?? {};
  const calories =
    nutriments['energy-kcal_serving'] ??
    nutriments['energy-kcal_100g'] ??
    nutriments['energy-kcal'] ??
    0;
  const protein =
    nutriments.proteins_serving ?? nutriments.proteins_100g ?? nutriments.proteins ?? 0;
  const carbs =
    nutriments.carbohydrates_serving ??
    nutriments.carbohydrates_100g ??
    nutriments.carbohydrates ??
    0;
  const fat = nutriments.fat_serving ?? nutriments.fat_100g ?? nutriments.fat ?? 0;

  return {
    name,
    brand: product.brands?.trim() || null,
    barcode: product.code?.trim() || null,
    servingLabel: product.serving_size?.trim() || product.quantity?.trim() || '100 g',
    servingGrams: null,
    calories: Number(calories) || 0,
    proteinG: Number(protein) || 0,
    carbsG: Number(carbs) || 0,
    fatG: Number(fat) || 0,
    imageUrl: product.image_front_small_url || product.image_url || null,
    source: 'open_food_facts',
  };
}

export async function fetchOpenFoodFactsByBarcode(barcode: string): Promise<CalioFood | null> {
  const response = await fetch(
    `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`,
  );
  if (!response.ok) {
    throw new Error('Could not reach Open Food Facts.');
  }
  const json = (await response.json()) as { status?: number; product?: OffProduct };
  if (json.status !== 1 || !json.product) {
    return null;
  }
  return normalizeOpenFoodFactsProduct(json.product);
}
