'use client';

import { useState, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input, Label } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { createUser } from '@/features/users/actions';

export function CreateUserButton() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <Button type="button" size="sm" onClick={() => setOpen(true)}>
        Create user
      </Button>
      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setError(null);
        }}
        title="Create user"
        description="Creates an Auth account in the shared Supabase project."
      >
        <form
          action={(formData) => {
            setError(null);
            startTransition(async () => {
              try {
                await createUser(formData);
                setOpen(false);
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Create failed');
              }
            });
          }}
          className="space-y-3"
        >
          <div>
            <Label htmlFor="cu-email">Email</Label>
            <Input id="cu-email" name="email" type="email" required autoComplete="off" />
          </div>
          <div>
            <Label htmlFor="cu-password">Temporary password</Label>
            <Input
              id="cu-password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <div>
            <Label htmlFor="cu-name">Display name</Label>
            <Input id="cu-name" name="display_name" />
          </div>
          <div className="flex flex-wrap gap-4 rounded-[10px] border border-hairline bg-bone/40 p-3">
            <Checkbox name="admin" value="1" label="Grant admin" />
            <Checkbox name="tester" value="1" label="Grant tester" />
          </div>
          {error ? <p className="text-sm text-error">{error}</p> : null}
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? 'Creating…' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
