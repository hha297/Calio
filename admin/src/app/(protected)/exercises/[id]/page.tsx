import { notFound } from 'next/navigation';

import { Topbar } from '@/components/layout/topbar';
import { Card } from '@/components/ui/card';
import { ExerciseForm } from '@/features/exercises/exercise-form';
import { ExercisePreview } from '@/features/exercises/exercise-preview';
import { createClient } from '@/lib/supabase/server';

export default async function ExerciseDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; tab?: string }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const tab = query.tab === 'edit' ? 'edit' : 'preview';
  const supabase = await createClient();
  const { data } = await supabase
    .from('exercises')
    .select(
      'id, name, slug, category, exercise_type, difficulty, equipment, movement_pattern, primary_muscles, secondary_muscles, met_value, instructions, overview, tips, common_mistakes, safety_notes, description, image_key, image_url, image_storage_path, library_paths, archived_at, is_system, content_version',
    )
    .eq('id', id)
    .eq('is_system', true)
    .maybeSingle();

  if (!data) notFound();

  return (
    <>
      <Topbar
        title={data.name}
        description={`System exercise · content v${data.content_version ?? 1}`}
      />
      <div className="space-y-5 p-8">
        <div className="flex gap-2 rounded-full border border-hairline bg-card p-1 w-fit">
          <a
            href={`/exercises/${id}`}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              tab === 'preview' ? 'bg-primary text-ink' : 'text-body'
            }`}
          >
            Mobile preview
          </a>
          <a
            href={`/exercises/${id}?tab=edit`}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              tab === 'edit' ? 'bg-primary text-ink' : 'text-body'
            }`}
          >
            Edit
          </a>
        </div>

        {tab === 'preview' ? (
          <div className="mx-auto max-w-2xl">
            <ExercisePreview exercise={data} />
          </div>
        ) : (
          <Card>
            <ExerciseForm exercise={data} saved={query.saved === '1'} />
          </Card>
        )}
      </div>
    </>
  );
}
