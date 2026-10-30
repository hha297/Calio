import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { radii, spacing } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  body?: string;
  cancelLabel: string;
  confirmLabel: string;
  /** Defaults to destructive confirm styling. */
  confirmVariant?: 'primary' | 'destructive';
  onCancel: () => void;
  onConfirm: () => void;
};

/** Centered confirmation dialog using Calio surface tokens (not system Alert). */
export function ConfirmDialog({
  visible,
  title,
  body,
  cancelLabel,
  confirmLabel,
  confirmVariant = 'destructive',
  onCancel,
  onConfirm,
}: ConfirmDialogProps) {
  const colors = useThemeColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View style={styles.root}>
        <Pressable
          style={[styles.backdrop, { backgroundColor: colors.overlay }]}
          accessibilityRole="button"
          accessibilityLabel={cancelLabel}
          onPress={onCancel}
        />
        <View
          accessibilityRole="summary"
          style={[
            styles.panel,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: radii.lg,
            },
          ]}
        >
          <Text variant="headingSmall">{title}</Text>
          {body ? (
            <Text variant="bodySmall" tone="secondary" className="mt-2">
              {body}
            </Text>
          ) : null}
          <View className="mt-5 gap-2">
            <Button
              label={confirmLabel}
              variant={confirmVariant}
              onPress={onConfirm}
              fullWidth
            />
            <Button label={cancelLabel} variant="secondary" onPress={onCancel} fullWidth />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing[5],
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  panel: {
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing[5],
    zIndex: 1,
  },
});
