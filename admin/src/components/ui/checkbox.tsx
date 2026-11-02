import { Check, Minus } from 'lucide-react';

import { cn } from '@/lib/utils';

export function Checkbox({
  className,
  label,
  checked,
  defaultChecked,
  indeterminate,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  /** Visual-only partial state (e.g. header “some selected”). */
  indeterminate?: boolean;
}) {
  const showMinus = Boolean(indeterminate) && checked !== true;

  return (
    <label
      className={cn(
        'group/check inline-flex cursor-pointer items-center gap-2.5 text-sm text-body select-none',
        props.disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      <span className={cn('relative inline-flex h-5 w-5 shrink-0 items-center justify-center', className)}>
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          defaultChecked={defaultChecked}
          {...props}
        />
        <span
          className={cn(
            'absolute inset-0 rounded-full border-2 transition',
            'border-hairline bg-card',
            'group-hover/check:border-mute',
            'peer-focus-visible:ring-2 peer-focus-visible:ring-primary/35 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-card',
            'peer-checked:border-primary peer-checked:bg-primary peer-checked:group-hover/check:border-primary',
            showMinus && 'border-primary bg-primary/25',
          )}
          aria-hidden
        />
        <Check
          className={cn(
            'pointer-events-none relative z-[1] h-3 w-3 stroke-[3] text-ink transition',
            'scale-75 opacity-0',
            'peer-checked:scale-100 peer-checked:opacity-100',
            showMinus && 'hidden',
          )}
          aria-hidden
        />
        <Minus
          className={cn(
            'pointer-events-none absolute z-[1] h-3 w-3 stroke-[3] text-primary transition',
            showMinus ? 'scale-100 opacity-100' : 'hidden scale-75 opacity-0',
          )}
          aria-hidden
        />
      </span>
      {label ? <span>{label}</span> : null}
    </label>
  );
}
