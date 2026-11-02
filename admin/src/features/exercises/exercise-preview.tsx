import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CoachingBody } from '@/features/exercises/coaching-body';
import { resolveExerciseImageUrl } from '@/features/exercises/exercise-images';

import type { ExerciseFormValues } from './exercise-form';

export function ExercisePreview({ exercise }: { exercise: ExerciseFormValues }) {
  const imageUrl = resolveExerciseImageUrl({
    imageUrl: exercise.image_url,
    imageStoragePath: (exercise as { image_storage_path?: string | null }).image_storage_path,
    imageKey: exercise.image_key,
    slug: exercise.slug,
  });

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[16px] border border-hairline bg-bone aspect-[4/3]">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={exercise.name ?? 'Exercise'}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ash">
            No image in Storage yet
          </div>
        )}
      </div>

      <Card className="space-y-2.5">
        <MetaRow label="Primary muscles" value={(exercise.primary_muscles ?? []).join(', ') || '—'} />
        <MetaRow
          label="Secondary muscles"
          value={(exercise.secondary_muscles ?? []).join(', ') || '—'}
        />
        <MetaRow label="Equipment" value={exercise.equipment || '—'} />
        <MetaRow label="Type" value={exercise.exercise_type || '—'} />
        <MetaRow label="Difficulty" value={exercise.difficulty || '—'} />
        <MetaRow label="Movement" value={exercise.movement_pattern || '—'} />
      </Card>

      {exercise.description ? (
        <Card className="space-y-2">
          <SectionLabel>Overview</SectionLabel>
          <CoachingBody text={exercise.description} />
        </Card>
      ) : null}

      {exercise.instructions ? (
        <Card className="space-y-2">
          <SectionLabel>Instructions</SectionLabel>
          <CoachingBody text={exercise.instructions} />
        </Card>
      ) : null}

      {exercise.tips ? (
        <Card className="space-y-2">
          <SectionLabel>Tips</SectionLabel>
          <CoachingBody text={exercise.tips} />
        </Card>
      ) : null}

      {exercise.common_mistakes ? (
        <Card className="space-y-2 border-warning/40">
          <SectionLabel className="text-warning">Common mistakes</SectionLabel>
          <CoachingBody text={exercise.common_mistakes} />
        </Card>
      ) : null}

      {exercise.safety_notes ? (
        <Card className="space-y-2 border-error/40">
          <SectionLabel className="text-error">Safety</SectionLabel>
          <CoachingBody text={exercise.safety_notes} />
        </Card>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {(exercise.library_paths ?? []).map((path) => (
          <Badge key={path}>{path}</Badge>
        ))}
      </div>
    </div>
  );
}

function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`text-[11px] font-semibold uppercase tracking-[0.12em] text-mute ${className ?? ''}`}
    >
      {children}
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-mute">{label}</span>
      <span className="max-w-[65%] text-right font-medium text-ink">{value}</span>
    </div>
  );
}
