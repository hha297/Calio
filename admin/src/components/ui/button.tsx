import { cn } from '@/lib/utils';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
};

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex cursor-pointer items-center justify-center rounded-full font-semibold transition disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'min-h-8 px-3 text-sm' : 'min-h-11 px-5 text-base',
        variant === 'primary' &&
          'bg-primary text-ink hover:bg-primary-pressed',
        variant === 'secondary' &&
          'border border-hairline bg-card text-ink hover:bg-bone',
        variant === 'ghost' && 'text-body hover:bg-bone',
        variant === 'danger' &&
          'border border-error/30 bg-transparent text-error hover:bg-error/10',
        className,
      )}
      {...props}
    />
  );
}
