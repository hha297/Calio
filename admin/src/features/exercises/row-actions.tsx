'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input, Label, TextArea } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Select } from '@/components/ui/select';
import { deleteExercise, quickSaveExercise } from '@/features/exercises/actions';

export type ExerciseRow = {
  id: string;
  name: string;
  category: string | null;
  exercise_type: string | null;
  difficulty: string | null;
  equipment: string | null;
  description: string | null;
  instructions: string | null;
  archived_at: string | null;
};

export function ExerciseRowActions({ exercise }: { exercise: ExerciseRow }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Button type="button" size="sm" variant="secondary" onClick={() => setEditOpen(true)}>
          <Pencil className="mr-1 h-3.5 w-3.5" />
          Edit
        </Button>
        <Button type="button" size="sm" variant="danger" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="mr-1 h-3.5 w-3.5" />
          Delete
        </Button>
      </div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit exercise"
        description={exercise.name}
        className="max-w-2xl"
      >
        <form
          action={(formData) => {
            startTransition(async () => {
              await quickSaveExercise(formData);
              setEditOpen(false);
            });
          }}
          className="space-y-3"
        >
          <input type="hidden" name="id" value={exercise.id} />
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label htmlFor={`qe-name-${exercise.id}`}>Name</Label>
              <Input
                id={`qe-name-${exercise.id}`}
                name="name"
                required
                defaultValue={exercise.name}
              />
            </div>
            <div>
              <Label htmlFor={`qe-category-${exercise.id}`}>Category</Label>
              <Input
                id={`qe-category-${exercise.id}`}
                name="category"
                required
                defaultValue={exercise.category ?? ''}
              />
            </div>
            <div>
              <Label htmlFor={`qe-type-${exercise.id}`}>Type</Label>
              <Select
                id={`qe-type-${exercise.id}`}
                name="exercise_type"
                defaultValue={exercise.exercise_type ?? 'strength'}
                className="w-full"
              >
                <option value="strength">Strength</option>
                <option value="bodyweight">Bodyweight</option>
                <option value="cardio">Cardio</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div>
              <Label htmlFor={`qe-diff-${exercise.id}`}>Difficulty</Label>
              <Input
                id={`qe-diff-${exercise.id}`}
                name="difficulty"
                defaultValue={exercise.difficulty ?? ''}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor={`qe-eq-${exercise.id}`}>Equipment</Label>
              <Input
                id={`qe-eq-${exercise.id}`}
                name="equipment"
                defaultValue={exercise.equipment ?? ''}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor={`qe-desc-${exercise.id}`}>Overview</Label>
              <TextArea
                id={`qe-desc-${exercise.id}`}
                name="description"
                rows={4}
                defaultValue={exercise.description ?? ''}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor={`qe-instr-${exercise.id}`}>Instructions</Label>
              <TextArea
                id={`qe-instr-${exercise.id}`}
                name="instructions"
                rows={5}
                defaultValue={exercise.instructions ?? ''}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete exercise?"
        description="Permanently removes this system exercise from the catalog. This cannot be undone."
      >
        <form
          action={(formData) => {
            startTransition(async () => {
              try {
                await deleteExercise(formData);
                setDeleteOpen(false);
                router.refresh();
              } catch (error) {
                console.error(error);
                window.alert(error instanceof Error ? error.message : 'Delete failed');
              }
            });
          }}
          className="space-y-3"
        >
          <input type="hidden" name="id" value={exercise.id} />
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" disabled={pending}>
              {pending ? 'Deleting…' : 'Confirm delete'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
