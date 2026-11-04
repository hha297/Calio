import { AppleMark, GooglePlayMark } from '@/components/store/store-marks';
import { getStoreStatus, siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

type StoreBadgesProps = {
  className?: string;
  size?: 'md' | 'lg';
  /** Use on the dark download band so contrast stays correct in light & dark site themes. */
  variant?: 'default' | 'onDark';
};

function BadgeShell({
  href,
  available,
  children,
  label,
  className,
}: {
  href: string;
  available: boolean;
  children: React.ReactNode;
  label: string;
  className?: string;
}) {
  const classes = cn(
    'inline-flex min-h-14 items-center gap-3 rounded-2xl border px-4 py-3 text-left transition',
    className,
  );

  if (available) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" aria-label={label}>
        {children}
      </a>
    );
  }

  return (
    <span className={cn(classes, 'cursor-default')} aria-label={label} role="img">
      {children}
    </span>
  );
}

export function StoreBadges({ className, size = 'md', variant = 'default' }: StoreBadgesProps) {
  const status = getStoreStatus();
  const titleClass = size === 'lg' ? 'text-base' : 'text-sm';
  const onDark = variant === 'onDark';

  const androidClass = onDark
    ? 'border-transparent bg-primary text-on-primary hover:bg-primary-pressed'
    : 'border-hairline bg-primary text-on-primary hover:bg-primary-pressed';

  const iosClass = onDark
    ? 'border-white/20 bg-white/5 text-white/85'
    : 'border-hairline bg-card text-mute';

  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      <BadgeShell
        href={siteConfig.googlePlayUrl}
        available={status.googlePlay}
        label={status.googlePlay ? 'Get it on Google Play' : 'Google Play — Android, free, listing soon'}
        className={androidClass}
      >
        <GooglePlayMark className="size-7 shrink-0" />
        <span>
          <span
            className={cn(
              'block text-[11px] uppercase tracking-[0.12em]',
              onDark ? 'text-on-primary/70' : 'text-on-primary/75',
            )}
          >
            {status.googlePlay ? 'Get it on' : 'Android · Free'}
          </span>
          <span className={cn('block font-semibold leading-tight', titleClass)}>Google Play</span>
        </span>
      </BadgeShell>
      <BadgeShell
        href={siteConfig.appStoreUrl}
        available={status.appStore}
        label={status.appStore ? 'Download on the App Store' : 'App Store — iOS coming later'}
        className={iosClass}
      >
        <AppleMark className="size-7 shrink-0 opacity-90" />
        <span>
          <span
            className={cn(
              'block text-[11px] uppercase tracking-[0.12em]',
              onDark ? 'text-white/45' : 'text-mute',
            )}
          >
            {status.appStore ? 'Download on the' : 'iOS · Coming later'}
          </span>
          <span className={cn('block font-semibold leading-tight', titleClass)}>App Store</span>
        </span>
      </BadgeShell>
    </div>
  );
}
