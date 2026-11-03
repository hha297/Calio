import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

const sizes = {
  sm: { logo: 28, text: 'text-xl', gap: 'gap-2' },
  md: { logo: 36, text: 'text-2xl', gap: 'gap-2.5' },
  lg: { logo: 48, text: 'text-4xl', gap: 'gap-3' },
} as const;

type BrandMarkProps = {
  size?: keyof typeof sizes;
  href?: string | null;
  className?: string;
};

export function BrandMark({ size = 'md', href = '/', className }: BrandMarkProps) {
  const dims = sizes[size];
  const content = (
    <span className={cn('inline-flex items-center', dims.gap, className)}>
      <Image
        src="/images/branding/translogo.png"
        alt=""
        width={dims.logo}
        height={dims.logo}
        className="shrink-0"
        priority={size !== 'sm'}
      />
      <span
        className={cn(
          'font-display font-extrabold leading-none tracking-tight text-ink',
          dims.text,
        )}
      >
        Track<span className="text-primary">wise</span>
      </span>
    </span>
  );

  if (href === null) {
    return content;
  }

  return (
    <Link href={href} className="inline-flex rounded-md" aria-label="Trackwise home">
      {content}
    </Link>
  );
}
