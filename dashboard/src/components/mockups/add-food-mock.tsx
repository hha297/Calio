import { ScreenshotMock } from '@/components/mockups/screenshot-mock';

export function AddFoodMock({
  className,
  label = 'Add food',
}: {
  className?: string;
  label?: string;
}) {
  return (
    <ScreenshotMock
      src="/images/add-food.jpg"
      alt="Trackwise Add food screen for creating a custom food entry"
      label={label}
      className={className}
    />
  );
}
