import { Topbar } from '@/components/layout/topbar';
import { Card } from '@/components/ui/card';
import { FoodForm } from '@/features/foods/food-form';
import { getDictionary } from '@/i18n';

export default async function NewFoodPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const t = getDictionary();
  const params = await searchParams;
  return (
    <>
      <Topbar title={t.foods.create} />
      <div className="p-6">
        <Card>
          <FoodForm barcodeError={params.error === 'barcode'} />
        </Card>
      </div>
    </>
  );
}
