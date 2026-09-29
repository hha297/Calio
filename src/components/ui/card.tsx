import { View, type ViewProps } from 'react-native';

import { cx } from '@/utils/cx';

type CardProps = ViewProps & {
  className?: string;
};

export function Card({ className, ...props }: CardProps) {
  return (
    <View className={cx('rounded-lg border border-border bg-surface p-4', className)} {...props} />
  );
}
