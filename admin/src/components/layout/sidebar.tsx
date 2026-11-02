'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Apple,
  Dumbbell,
  Flag,
  LayoutDashboard,
  ScrollText,
  Settings,
  Terminal,
  Users,
  Database,
} from 'lucide-react';

import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard, group: 'Overview' },
  { href: '/exercises', label: 'Exercises', icon: Dumbbell, group: 'Catalog' },
  { href: '/foods', label: 'Foods', icon: Apple, group: 'Catalog' },
  { href: '/users', label: 'User management', icon: Users, group: 'Users' },
  { href: '/user-data', label: 'User data', icon: Database, group: 'Users' },
  { href: '/system/flags', label: 'Feature flags', icon: Flag, group: 'System' },
  { href: '/system/audit', label: 'Audit logs', icon: ScrollText, group: 'System' },
  { href: '/system/settings', label: 'Catalog health', icon: Settings, group: 'System' },
  { href: '/system/commands', label: 'Ops commands', icon: Terminal, group: 'System' },
];

export function Sidebar() {
  const pathname = usePathname();
  let lastGroup = '';

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-hairline bg-canvas">
      <div className="border-b border-hairline px-5 py-5">
        <div className="font-display text-2xl font-extrabold tracking-tight text-ink">
          Trackwise
        </div>
        <div className="mt-0.5 text-xs font-medium uppercase tracking-[0.14em] text-ash">
          Admin
        </div>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {links.map((link) => {
          const showGroup = link.group !== lastGroup;
          lastGroup = link.group;
          const active =
            link.href === '/'
              ? pathname === '/'
              : pathname === link.href || pathname.startsWith(`${link.href}/`);
          const Icon = link.icon;
          return (
            <div key={link.href}>
              {showGroup ? (
                <div className="mb-1.5 mt-4 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-ash first:mt-1">
                  {link.group}
                </div>
              ) : null}
              <Link
                href={link.href}
                className={cn(
                  'flex items-center gap-2.5 rounded-[10px] px-3 py-2.5 text-sm transition',
                  active
                    ? 'bg-card font-semibold text-ink ring-1 ring-hairline'
                    : 'text-body hover:bg-bone/80',
                )}
              >
                <Icon
                  className={cn('h-4 w-4', active ? 'text-primary-deep' : 'text-ash')}
                  strokeWidth={active ? 2.25 : 1.75}
                />
                {link.label}
              </Link>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
