export type NutritionBasis =
  | { kind: 'per100'; unit: 'g' | 'ml' }
  | { kind: 'serving'; label: string; amount: number | null; unit: 'g' | 'ml' | null };

export type CalioFood = {
  name: string;
  brand: string | null;
  barcode: string;
  basis: NutritionBasis;
  serving: { label: string; amount: number; unit: 'g' | 'ml' } | null;
  calories: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
  fiberG: number | null;
  sugarsG: number | null;
  saltG: number | null;
  imageUrl: string | null;
  source: 'open_food_facts';
};

type OffProduct = {
  product_name?: string;
  brands?: string;
  code?: string;
  image_front_small_url?: string;
  image_front_url?: string;
  image_url?: string;
  nutriments?: Record<string, number | string | undefined>;
  serving_size?: string;
  nutrition_data_per?: string;
  product_quantity_unit?: string;
  quantity?: string;
};

type OffResponse = {
  status?: number;
  status_verbose?: string;
  code?: string;
  product?: OffProduct;
};

export type FoodLookupErrorKind =
  'network' | 'timeout' | 'rate_limit' | 'server' | 'invalid_response';

export class FoodLookupError extends Error {
  constructor(
    public readonly kind: FoodLookupErrorKind,
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'FoodLookupError';
  }
}

export type FoodLookupResult =
  { status: 'found'; food: CalioFood } | { status: 'not_found'; barcode: string };

const OFF_FIELDS = [
  'code',
  'product_name',
  'brands',
  'image_front_small_url',
  'image_front_url',
  'image_url',
  'nutriments',
  'serving_size',
  'nutrition_data_per',
  'product_quantity_unit',
  'quantity',
].join(',');

export function isSupportedProductBarcode(type: string, data: string) {
  if (!/^\d+$/.test(data)) return false;
  if (type === 'ean13') return data.length === 13;
  if (type === 'ean8') return data.length === 8;
  if (type === 'upc_a') return data.length === 12;
  if (type === 'upc_e') return data.length >= 6 && data.length <= 8;
  return type === 'itf14' && data.length === 14;
}

function numberOrNull(value: number | string | undefined) {
  if (value === undefined || value === '') return null;
  const parsed = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseServing(value?: string) {
  if (!value) return { amount: null, unit: null } as const;
  const match = value.trim().match(/(\d+(?:[.,]\d+)?)\s*(ml|g)\b/i);
  if (!match) return { amount: null, unit: null } as const;
  return {
    amount: Number(match[1].replace(',', '.')),
    unit: match[2].toLowerCase() as 'g' | 'ml',
  };
}

function productUnit(product: OffProduct, servingUnit: 'g' | 'ml' | null): 'g' | 'ml' {
  const explicit = product.product_quantity_unit?.toLowerCase();
  if (explicit === 'ml' || explicit === 'cl' || explicit === 'l') return 'ml';
  if (servingUnit === 'ml' || /\b(?:ml|cl|l)\b/i.test(product.quantity ?? '')) return 'ml';
  return 'g';
}

function nutrient(nutriments: OffProduct['nutriments'], key: string, suffix: '100g' | 'serving') {
  return numberOrNull(nutriments?.[`${key}_${suffix}`]);
}

export function normalizeOpenFoodFactsProduct(
  product: OffProduct,
  requestedBarcode = '',
): CalioFood {
  const name = product.product_name?.trim() ?? '';

  const serving = parseServing(product.serving_size);
  const hasPer100 = ['energy-kcal', 'proteins', 'carbohydrates', 'fat'].some(
    (key) => nutrient(product.nutriments, key, '100g') !== null,
  );
  const hasServing = ['energy-kcal', 'proteins', 'carbohydrates', 'fat'].some(
    (key) => nutrient(product.nutriments, key, 'serving') !== null,
  );
  const useServing = !hasPer100 && hasServing;
  const suffix = useServing ? 'serving' : '100g';
  const unit = productUnit(product, serving.unit);

  return {
    name,
    brand: product.brands?.trim() || null,
    barcode: product.code?.trim() || requestedBarcode,
    basis: useServing
      ? {
          kind: 'serving',
          label: product.serving_size?.trim() || '1 serving',
          amount: serving.amount,
          unit: serving.unit,
        }
      : { kind: 'per100', unit },
    serving:
      serving.amount && serving.unit
        ? { label: product.serving_size!.trim(), amount: serving.amount, unit: serving.unit }
        : null,
    calories: nutrient(product.nutriments, 'energy-kcal', suffix),
    proteinG: nutrient(product.nutriments, 'proteins', suffix),
    carbsG: nutrient(product.nutriments, 'carbohydrates', suffix),
    fatG: nutrient(product.nutriments, 'fat', suffix),
    fiberG: nutrient(product.nutriments, 'fiber', suffix),
    sugarsG: nutrient(product.nutriments, 'sugars', suffix),
    saltG: nutrient(product.nutriments, 'salt', suffix),
    imageUrl: product.image_front_small_url || product.image_front_url || product.image_url || null,
    source: 'open_food_facts',
  };
}

export async function fetchOpenFoodFactsByBarcode(
  barcode: string,
  options: { signal?: AbortSignal; timeoutMs?: number } = {},
): Promise<FoodLookupResult> {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? 10_000;
  let timedOut = false;
  const timeout = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const abort = () => controller.abort();
  options.signal?.addEventListener('abort', abort, { once: true });

  try {
    let response: Response;
    try {
      response = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json?fields=${encodeURIComponent(OFF_FIELDS)}`,
        {
          signal: controller.signal,
          headers: { 'User-Agent': 'Calio/1.0 (mobile food scanner)' },
        },
      );
    } catch (error) {
      if (timedOut) throw new FoodLookupError('timeout', 'Open Food Facts timed out.');
      if (options.signal?.aborted) throw error;
      throw new FoodLookupError('network', 'Could not connect to Open Food Facts.');
    }

    if (response.status === 429) {
      throw new FoodLookupError(
        'rate_limit',
        'Open Food Facts is receiving too many requests.',
        429,
      );
    }
    if (response.status >= 500) {
      throw new FoodLookupError(
        'server',
        'Open Food Facts is temporarily unavailable.',
        response.status,
      );
    }
    if (!response.ok) {
      throw new FoodLookupError(
        'invalid_response',
        'Open Food Facts rejected the request.',
        response.status,
      );
    }

    let json: OffResponse;
    try {
      json = (await response.json()) as OffResponse;
    } catch {
      throw new FoodLookupError(
        'invalid_response',
        'Open Food Facts returned an invalid response.',
      );
    }
    if (json.status === 0 || !json.product) return { status: 'not_found', barcode };
    if (json.status !== 1) {
      throw new FoodLookupError('invalid_response', 'Open Food Facts returned an unknown status.');
    }
    return { status: 'found', food: normalizeOpenFoodFactsProduct(json.product, barcode) };
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener('abort', abort);
  }
}
