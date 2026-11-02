import { requireAdmin } from '@/lib/auth';
import { signOut } from '@/features/auth/actions';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/theme-toggle';

export async function Topbar({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  const session = await requireAdmin();

  return (
    <header className="flex items-start justify-between gap-4 border-b border-hairline bg-canvas/80 px-5 py-4 backdrop-blur">
      <div className="min-w-0">
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm text-mute">{description}</p>
        ) : (
          <p className="mt-1 text-sm text-mute">{session.email}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2 pt-1">
        <ThemeToggle />
        <form action={signOut}>
          <Button type="submit" variant="secondary" size="sm">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  );
}
