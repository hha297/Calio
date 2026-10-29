import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  fetchOpenFoodFactsByBarcode,
  FoodLookupError,
  isSupportedProductBarcode,
  normalizeOpenFoodFactsProduct,
} from './open-food-facts';

afterEach(() => vi.unstubAllGlobals());

describe('normalizeOpenFoodFactsProduct', () => {
  it('prefers a consistent per-100 basis and preserves missing nutrients', () => {
    const food = normalizeOpenFoodFactsProduct(
      {
        product_name: 'Greek Yogurt',
        brands: 'Example',
        code: '00123',
        serving_size: '150 g',
        nutriments: {
          'energy-kcal_100g': 80,
          proteins_100g: 10,
          carbohydrates_100g: 5,
        },
      },
      '00123',
    );
    expect(food).toMatchObject({
      barcode: '00123',
      basis: { kind: 'per100', unit: 'g' },
      calories: 80,
      proteinG: 10,
      carbsG: 5,
      fatG: null,
    });
  });

  it('uses a serving basis only when per-100 values are unavailable', () => {
    const food = normalizeOpenFoodFactsProduct({
      product_name: 'Snack',
      serving_size: '30 g',
      nutriments: { 'energy-kcal_serving': 120, proteins_serving: 3 },
    });
    expect(food?.basis).toEqual({ kind: 'serving', label: '30 g', amount: 30, unit: 'g' });
    expect(food?.fatG).toBeNull();
  });

  it('keeps a found product with incomplete identity and nutrition editable', () => {
    const food = normalizeOpenFoodFactsProduct({ code: '123' }, '123');
    expect(food).toMatchObject({ name: '', imageUrl: null, calories: null, fatG: null });
  });
});

describe('barcode validation', () => {
  it('keeps leading zeroes and rejects non-product payloads', () => {
    expect(isSupportedProductBarcode('ean13', '0123456789012')).toBe(true);
    expect(isSupportedProductBarcode('qr', 'https://example.com')).toBe(false);
    expect(isSupportedProductBarcode('code128', 'ABC-123')).toBe(false);
  });
});

describe('fetchOpenFoodFactsByBarcode', () => {
  it('distinguishes not found from errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: 0 }), { status: 200 })),
    );
    await expect(fetchOpenFoodFactsByBarcode('00123')).resolves.toEqual({
      status: 'not_found',
      barcode: '00123',
    });
  });

  it('classifies rate limiting', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 429 })));
    await expect(fetchOpenFoodFactsByBarcode('123')).rejects.toMatchObject<
      Partial<FoodLookupError>
    >({ kind: 'rate_limit', status: 429 });
  });

  it('classifies server errors separately', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 503 })));
    await expect(fetchOpenFoodFactsByBarcode('123')).rejects.toMatchObject<
      Partial<FoodLookupError>
    >({ kind: 'server', status: 503 });
  });

  it('classifies a request timeout', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_url, init?: RequestInit) =>
          new Promise((_resolve, reject) => {
            init?.signal?.addEventListener('abort', () => reject(new Error('aborted')));
          }),
      ),
    );
    await expect(fetchOpenFoodFactsByBarcode('123', { timeoutMs: 1 })).rejects.toMatchObject<
      Partial<FoodLookupError>
    >({ kind: 'timeout' });
  });
});
