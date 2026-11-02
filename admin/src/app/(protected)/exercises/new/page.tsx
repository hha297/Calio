import { Topbar } from '@/components/layout/topbar';
import { Card } from '@/components/ui/card';
import { ExerciseForm } from '@/features/exercises/exercise-form';
import { getDictionary } from '@/i18n';

export default function NewExercisePage() {
  const t = getDictionary();
  return (
    <>
      <Topbar title={t.exercises.create} />
      <div className="p-6">
        <Card>
          <ExerciseForm />
        </Card>
      </div>
    </>
  );
}
