import { ScreenshotMock } from '@/components/mockups/screenshot-mock';

export function ProgressMock({
  className,
  label = 'Progress trends',
}: {
  className?: string;
  label?: string;
}) {
  return (
    <ScreenshotMock
      src="/images/progress.jpg"
      alt="Trackwise progress dashboard with nutrition and workout trends"
      label={label}
      className={className}
    />
  );
}
