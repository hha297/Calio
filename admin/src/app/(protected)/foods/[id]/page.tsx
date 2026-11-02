import { notFound } from 'next/navigation';

import { Topbar } from '@/components/layout/topbar';
import { Card } from '@/components/ui/card';
import { FoodForm } from '@/features/foods/food-form';
import { createClient } from '@/lib/supabase/server';

export default async function FoodDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase.from('foods').select('*').eq('id', id).maybeSingle();
  if (!data) notFound();

  return (
    <>
      <Topbar title={data.name} />
      <div className="p-6">
        <Card>
          <FoodForm
            food={data}
            saved={query.saved === '1'}
            barcodeError={query.error === 'barcode'}
          />
        </Card>
        <p className="mt-3 text-xs text-[#8d8d8d]">
          Editing catalog foods does not rewrite historical food_entries snapshots.
        </p>
      </div>
    </>
  );
}
