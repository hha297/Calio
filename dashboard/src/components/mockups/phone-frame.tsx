import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type PhoneFrameProps = {
  children: ReactNode;
  className?: string;
  label?: string;
  glow?: boolean;
};

/**
 * Samsung / Android-style device frame (punch-hole camera, flatter corners).
 * Avoids iPhone Dynamic Island so real Android screenshots don't look mismatched.
 */
export function PhoneFrame({ children, className, label, glow = false }: PhoneFrameProps) {
  return (
    <figure
      className={cn(
        'relative mx-auto w-[min(100%,280px)]',
        glow && 'drop-shadow-[0_24px_60px_rgba(0,217,95,0.18)]',
        className,
      )}
    >
      <div
        className="relative overflow-hidden rounded-[28px] border-[9px] border-[#1a1a1a] bg-[#1a1a1a] shadow-phone"
        style={{ boxShadow: 'var(--shadow-phone), inset 0 0 0 1px rgba(255,255,255,0.06)' }}
      >
        {/* Punch-hole camera */}
        <div
          className="pointer-events-none absolute left-1/2 top-3 z-20 size-[11px] -translate-x-1/2 rounded-full bg-black ring-1 ring-white/15"
          aria-hidden
        >
          <span className="absolute inset-[3px] rounded-full bg-[#0b1a2a]" />
        </div>

        {/* Side keys (volume + power) — subtle Samsung cues */}
        <span
          aria-hidden
          className="absolute -left-[11px] top-[18%] h-10 w-[3px] rounded-l-sm bg-[#111]"
        />
        <span
          aria-hidden
          className="absolute -left-[11px] top-[30%] h-7 w-[3px] rounded-l-sm bg-[#111]"
        />
        <span
          aria-hidden
          className="absolute -right-[11px] top-[24%] h-14 w-[3px] rounded-r-sm bg-[#111]"
        />

        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[20px] bg-[#202020]">
          {children}
        </div>
      </div>
      {label ? (
        <figcaption className="mt-4 text-center text-sm font-medium text-mute">{label}</figcaption>
      ) : null}
    </figure>
  );
}

export function MockStatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-5 pt-3 text-[10px] font-semibold',
        dark ? 'text-white/80' : 'text-ink/70',
      )}
      aria-hidden
    >
      <span className="font-metric">9:41</span>
      <span className="flex items-center gap-1">
        <span className="inline-block h-2 w-3 rounded-[1px] border border-current opacity-70" />
        <span className="inline-block h-2.5 w-4 rounded-[2px] border border-current opacity-70" />
      </span>
    </div>
  );
}

export function MockTabBar({
  active,
}: {
  active: 'diary' | 'workout' | 'scan' | 'progress' | 'account';
}) {
  const items = [
    { id: 'diary', label: 'Diary' },
    { id: 'workout', label: 'Workout' },
    { id: 'scan', label: 'Scan' },
    { id: 'progress', label: 'Progress' },
    { id: 'account', label: 'Account' },
  ] as const;

  return (
    <div
      className="absolute inset-x-3 bottom-3 flex items-end justify-between rounded-full border border-hairline bg-card/95 px-2 py-2 shadow-soft backdrop-blur"
      aria-hidden
    >
      {items.map((item) => {
        const isScan = item.id === 'scan';
        const isActive = active === item.id;
        if (isScan) {
          return (
            <div
              key={item.id}
              className="-mt-5 flex size-12 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary shadow-soft"
            >
              Scan
            </div>
          );
        }
        return (
          <div
            key={item.id}
            className={cn(
              'flex min-w-[44px] flex-col items-center gap-0.5 px-1 text-[9px] font-semibold',
              isActive ? 'text-primary' : 'text-mute',
            )}
          >
            <span
              className={cn('size-1.5 rounded-full', isActive ? 'bg-primary' : 'bg-transparent')}
            />
            {item.label}
          </div>
        );
      })}
    </div>
  );
}
