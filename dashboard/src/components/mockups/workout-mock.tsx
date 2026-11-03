import { ScreenshotMock } from '@/components/mockups/screenshot-mock';

export function WorkoutMock({
  className,
  label = 'Workout tracking',
}: {
  className?: string;
  label?: string;
}) {
  return (
    <ScreenshotMock
      src="/images/workout.jpg"
      alt="Trackwise active workout with exercises and sets"
      label={label}
      className={className}
    />
  );
}
