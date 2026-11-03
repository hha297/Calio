import { ScreenshotMock } from '@/components/mockups/screenshot-mock';

export function GoalsMock({
  className,
  label = 'Personal goals',
}: {
  className?: string;
  label?: string;
}) {
  return (
    <ScreenshotMock
      src="/images/setup.jpg"
      alt="Trackwise setup summary with calorie and macro plan"
      label={label}
      className={className}
    />
  );
}
