import { cn } from '@/lib/utils';

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full rounded-[10px] border border-hairline bg-card px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-ash focus:border-primary',
        className,
      )}
      {...props}
    />
  );
}

export function TextArea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full rounded-[10px] border border-hairline bg-card px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-ash focus:border-primary',
        className,
      )}
      {...props}
    />
  );
}

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('mb-1.5 block text-sm font-medium text-body', className)}
      {...props}
    />
  );
}
