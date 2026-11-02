import { archiveFood, saveFood } from '@/features/foods/actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input, Label } from '@/components/ui/input';
import { getDictionary } from '@/i18n';

export type FoodFormValues = {
  id?: string;
  name?: string | null;
  brand?: string | null;
  barcode?: string | null;
  serving_label?: string | null;
  serving_grams?: number | null;
  calories?: number | null;
  protein_g?: number | null;
  carbs_g?: number | null;
  fat_g?: number | null;
  image_url?: string | null;
  is_public?: boolean | null;
  archived_at?: string | null;
};

export function FoodForm({
  food,
  saved,
  barcodeError,
}: {
  food?: FoodFormValues;
  saved?: boolean;
  barcodeError?: boolean;
}) {
  const t = getDictionary();
  return (
    <div className="space-y-4">
      {saved ? <Card className="bg-[#D8F8E6] text-sm">{t.foods.saved}</Card> : null}
      {barcodeError ? (
        <Card className="bg-[#fce8e8] text-sm text-[#d64545]">{t.foods.barcodeConflict}</Card>
      ) : null}
      <form action={saveFood} className="grid gap-4 md:grid-cols-2">
        {food?.id ? <input type="hidden" name="id" value={food.id} /> : null}
        <div>
          <Label htmlFor="name">{t.foods.name}</Label>
          <Input id="name" name="name" required defaultValue={food?.name ?? ''} />
        </div>
        <div>
          <Label htmlFor="brand">{t.foods.brand}</Label>
          <Input id="brand" name="brand" defaultValue={food?.brand ?? ''} />
        </div>
        <div>
          <Label htmlFor="barcode">{t.foods.barcode}</Label>
          <Input id="barcode" name="barcode" defaultValue={food?.barcode ?? ''} />
        </div>
        <div>
          <Label htmlFor="serving_label">{t.foods.serving}</Label>
          <Input
            id="serving_label"
            name="serving_label"
            required
            defaultValue={food?.serving_label ?? 'serving'}
          />
        </div>
        <div>
          <Label htmlFor="serving_grams">{t.foods.grams}</Label>
          <Input
            id="serving_grams"
            name="serving_grams"
            type="number"
            step="0.1"
            defaultValue={food?.serving_grams ?? ''}
          />
        </div>
        <div>
          <Label htmlFor="calories">{t.foods.calories}</Label>
          <Input id="calories" name="calories" type="number" step="0.1" required defaultValue={food?.calories ?? 0} />
        </div>
        <div>
          <Label htmlFor="protein_g">{t.foods.protein}</Label>
          <Input id="protein_g" name="protein_g" type="number" step="0.1" required defaultValue={food?.protein_g ?? 0} />
        </div>
        <div>
          <Label htmlFor="carbs_g">{t.foods.carbs}</Label>
          <Input id="carbs_g" name="carbs_g" type="number" step="0.1" required defaultValue={food?.carbs_g ?? 0} />
        </div>
        <div>
          <Label htmlFor="fat_g">{t.foods.fat}</Label>
          <Input id="fat_g" name="fat_g" type="number" step="0.1" required defaultValue={food?.fat_g ?? 0} />
        </div>
        <div>
          <Label htmlFor="image_url">Image URL</Label>
          <Input id="image_url" name="image_url" defaultValue={food?.image_url ?? ''} />
        </div>
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input type="checkbox" name="is_public" defaultChecked={food?.is_public ?? true} />
          {t.foods.public}
        </label>
        <div>
          <Button type="submit">{t.common.save}</Button>
        </div>
      </form>
      {food?.id ? (
        <form action={archiveFood} className="flex flex-wrap items-center gap-3">
          <input type="hidden" name="id" value={food.id} />
          <input type="hidden" name="restore" value={food.archived_at ? '1' : '0'} />
          <Button type="submit" variant={food.archived_at ? 'secondary' : 'danger'}>
            {food.archived_at ? t.common.restore : t.common.archive}
          </Button>
        </form>
      ) : null}
    </div>
  );
}
