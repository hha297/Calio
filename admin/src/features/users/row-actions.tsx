'use client';

import { useState, useTransition } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input, Label } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { Select } from '@/components/ui/select';
import { deleteUser, updateUser } from '@/features/users/actions';

export type UserRow = {
  id: string;
  displayName: string | null;
  email: string | null;
  roles: string[];
  status: string;
};

export function UserRowActions({ user }: { user: UserRow }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

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
        onClose={() => {
          setEditOpen(false);
          setError(null);
        }}
        title="Edit user"
        description={user.email ?? user.id}
      >
        <form
          action={(formData) => {
            setError(null);
            startTransition(async () => {
              try {
                await updateUser(formData);
                setEditOpen(false);
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Update failed');
              }
            });
          }}
          className="space-y-3"
        >
          <input type="hidden" name="user_id" value={user.id} />
          <div>
            <Label htmlFor={`u-name-${user.id}`}>Display name</Label>
            <Input
              id={`u-name-${user.id}`}
              name="display_name"
              defaultValue={user.displayName ?? ''}
            />
          </div>
          <div>
            <Label htmlFor={`u-status-${user.id}`}>Status</Label>
            <Select
              id={`u-status-${user.id}`}
              name="status"
              defaultValue={user.status}
              className="w-full"
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </Select>
          </div>
          <div className="flex flex-wrap gap-4 rounded-[10px] border border-hairline bg-bone/40 p-3">
            <Checkbox
              name="admin"
              value="1"
              defaultChecked={user.roles.includes('admin')}
              label="Admin"
            />
            <Checkbox
              name="tester"
              value="1"
              defaultChecked={user.roles.includes('tester')}
              label="Tester"
            />
          </div>
          {error ? <p className="text-sm text-error">{error}</p> : null}
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
        onClose={() => {
          setDeleteOpen(false);
          setError(null);
        }}
        title="Delete user?"
        description="Permanently deletes the Auth user and cascades owned Trackwise data."
      >
        <form
          action={(formData) => {
            setError(null);
            startTransition(async () => {
              try {
                await deleteUser(formData);
                setDeleteOpen(false);
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Delete failed');
              }
            });
          }}
          className="space-y-3"
        >
          <input type="hidden" name="user_id" value={user.id} />
          {error ? <p className="text-sm text-error">{error}</p> : null}
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
