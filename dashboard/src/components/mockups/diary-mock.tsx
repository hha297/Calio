import { ScreenshotMock } from '@/components/mockups/screenshot-mock';

export function DiaryMock({
  className,
  label = 'Daily diary',
}: {
  className?: string;
  label?: string;
}) {
  return (
    <ScreenshotMock
      src="/images/diary.jpg"
      alt="Trackwise diary screen showing daily calories and macros"
      label={label}
      className={className}
      glow
      priority
    />
  );
}
