import Link from 'next/link';

import { cn } from '@/lib/utils';

/** Segmented Active / Archived filter that preserves other query params. */
export function ArchivedToggle({
  activeHref,
  archivedHref,
  showArchived,
}: {
  activeHref: string;
  archivedHref: string;
  showArchived: boolean;
}) {
  return (
    <div className="inline-flex rounded-full border border-hairline bg-card p-0.5">
      <Link
        href={activeHref}
        className={cn(
          'cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-semibold transition',
          !showArchived ? 'bg-primary text-ink' : 'text-mute hover:text-ink',
        )}
      >
        Active
      </Link>
      <Link
        href={archivedHref}
        className={cn(
          'cursor-pointer rounded-full px-3.5 py-1.5 text-sm font-semibold transition',
          showArchived ? 'bg-primary text-ink' : 'text-mute hover:text-ink',
        )}
      >
        Archived
      </Link>
    </div>
  );
}
