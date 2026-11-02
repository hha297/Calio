'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { CheckSquare, Trash2, X } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Modal } from '@/components/ui/modal';
import { resolveExerciseImageUrl } from '@/features/exercises/exercise-images';
import { deleteExercises } from '@/features/exercises/actions';
import {
  ExerciseRowActions,
  type ExerciseRow,
} from '@/features/exercises/row-actions';

type ExerciseListRow = ExerciseRow & {
  image_url: string | null;
  image_key: string | null;
  image_storage_path: string | null;
  slug: string | null;
};

export function ExerciseListTable({
  rows,
  labels,
}: {
  rows: ExerciseListRow[];
  labels: { system: string; archived: string };
}) {
  const router = useRouter();
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const allIds = useMemo(() => rows.map((row) => row.id), [rows]);
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id));
  const selectedCount = selected.size;
  const someSelected = selectedCount > 0 && !allSelected;

  const exitSelectMode = () => {
    setSelecting(false);
    setSelected(new Set());
    setConfirmOpen(false);
  };

  const confirmBulkDelete = () => {
    const ids = [...selected];
    if (!ids.length) return;
    startTransition(async () => {
      try {
        await deleteExercises(ids);
        exitSelectMode();
        router.refresh();
      } catch (error) {
        console.error(error);
        window.alert(error instanceof Error ? error.message : 'Delete failed');
      }
    });
  };

  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected((prev) => {
      if (allIds.every((id) => prev.has(id))) return new Set();
      return new Set(allIds);
    });
  };

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        {selecting ? (
          <>
            <div className="flex flex-wrap items-center gap-2 text-sm text-mute">
              <span className="font-medium text-ink">
                {selectedCount} selected
              </span>
              <button
                type="button"
                className="cursor-pointer font-semibold text-primary-deep hover:underline"
                onClick={toggleAll}
              >
                {allSelected ? 'Clear all' : 'Select all'}
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="danger"
                disabled={selectedCount === 0}
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                Delete ({selectedCount})
              </Button>
              <Button type="button" size="sm" variant="secondary" onClick={exitSelectMode}>
                <X className="mr-1 h-3.5 w-3.5" />
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <span />
            <Button type="button" size="sm" variant="secondary" onClick={() => setSelecting(true)}>
              <CheckSquare className="mr-1 h-3.5 w-3.5" />
              Select
            </Button>
          </>
        )}
      </div>

      <Card className="overflow-x-auto p-0">
        <table className="w-full table-fixed text-left text-sm">
          <colgroup>
            {selecting ? <col className="w-10" /> : null}
            <col className={selecting ? 'w-[40%]' : 'w-[44%]'} />
            <col className="w-[14%]" />
            <col className="w-[12%]" />
            <col className="w-[12%]" />
            <col className={selecting ? 'w-[16%]' : 'w-[18%]'} />
          </colgroup>
          <thead className="bg-bone text-mute">
            <tr>
              {selecting ? (
                <th className="px-3 py-2.5">
                  <Checkbox
                    checked={allSelected}
                    indeterminate={someSelected}
                    onChange={toggleAll}
                    aria-label="Select all exercises"
                  />
                </th>
              ) : null}
              <th className="px-3 py-2.5 font-semibold">Exercise</th>
              <th className="px-3 py-2.5 font-semibold">Category</th>
              <th className="px-3 py-2.5 font-semibold">Type</th>
              <th className="px-3 py-2.5 font-semibold">Status</th>
              <th className="px-3 py-2.5 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const imageUrl = resolveExerciseImageUrl({
                imageUrl: row.image_url,
                imageStoragePath: row.image_storage_path,
                imageKey: row.image_key,
                slug: row.slug,
              });
              const isChecked = selected.has(row.id);
              return (
                <tr
                  key={row.id}
                  className={`border-t border-hairline ${isChecked ? 'bg-primary/5' : ''}`}
                >
                  {selecting ? (
                    <td className="px-3 py-2.5">
                      <Checkbox
                        checked={isChecked}
                        onChange={() => toggleOne(row.id)}
                        aria-label={`Select ${row.name}`}
                      />
                    </td>
                  ) : null}
                  <td className="px-3 py-2.5">
                    <Link
                      href={`/exercises/${row.id}`}
                      className="flex cursor-pointer items-center gap-2.5 font-semibold text-ink hover:text-primary-deep"
                    >
                      <span className="h-10 w-10 shrink-0 overflow-hidden rounded-[8px] border border-hairline bg-bone">
                        {imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={imageUrl} alt="" className="h-full w-full object-cover" />
                        ) : null}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate">{row.name}</span>
                        <span className="block truncate text-xs font-normal text-ash">
                          {row.description
                            ? `${String(row.description).slice(0, 56)}…`
                            : 'No overview'}
                        </span>
                      </span>
                    </Link>
                  </td>
                  <td className="truncate px-3 py-2.5 text-body capitalize">
                    {row.category}
                  </td>
                  <td className="truncate px-3 py-2.5 text-body capitalize">
                    {row.exercise_type}
                  </td>
                  <td className="px-3 py-2.5">
                    {row.archived_at ? (
                      <Badge className="border-error/30 bg-error/10 text-error">
                        {labels.archived}
                      </Badge>
                    ) : (
                      <Badge>{labels.system}</Badge>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <ExerciseRowActions exercise={row} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete selected exercises?"
        description={`Permanently removes ${selectedCount} system exercise${selectedCount === 1 ? '' : 's'} from the catalog. This cannot be undone.`}
      >
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="secondary" onClick={() => setConfirmOpen(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={pending || selectedCount === 0}
            onClick={confirmBulkDelete}
          >
            {pending ? 'Deleting…' : `Confirm delete (${selectedCount})`}
          </Button>
        </div>
      </Modal>
    </>
  );
}
