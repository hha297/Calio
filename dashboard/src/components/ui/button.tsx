import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/lib/utils';

const variants = {
  primary:
    'bg-primary text-on-primary hover:bg-primary-pressed shadow-[0_1px_0_rgba(32,32,32,0.06)]',
  secondary:
    'bg-card text-ink border border-hairline hover:bg-bone',
  ghost: 'bg-transparent text-ink hover:bg-bone',
  ink: 'bg-ink text-card hover:opacity-90',
} as const;

const sizes = {
  sm: 'h-10 px-4 text-sm',
  md: 'h-12 px-6 text-base',
  lg: 'h-14 px-8 text-base',
} as const;

type ButtonBase = {
  children: ReactNode;
  className?: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

type ButtonAsButton = ButtonBase &
  Omit<ComponentProps<'button'>, 'className' | 'children'> & {
    href?: undefined;
  };

type ButtonAsLink = ButtonBase & {
  href: string;
  external?: boolean;
  onClick?: ComponentProps<'a'>['onClick'];
};

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonAsButton | ButtonAsLink) {
  const classes = cn(
    'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  );

  if ('href' in props && props.href) {
    const { href, external, onClick } = props;
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button type={buttonProps.type ?? 'button'} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
