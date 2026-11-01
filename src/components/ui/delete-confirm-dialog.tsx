import { Trash2 } from 'lucide-react-native';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { radii, spacing } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';

type DeleteConfirmDialogProps = {
  visible: boolean;
  title: string;
  body?: string;
  cancelLabel: string;
  confirmLabel: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

/**
 * Calio-styled confirmation for irreversible delete actions.
 * Prefer this over system `Alert.alert` for any delete flow.
 */
export function DeleteConfirmDialog({
  visible,
  title,
  body,
  cancelLabel,
  confirmLabel,
  loading = false,
  onCancel,
  onConfirm,
}: DeleteConfirmDialogProps) {
  const colors = useThemeColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={loading ? undefined : onCancel}
      statusBarTranslucent
    >
      <View style={styles.root}>
        <Pressable
          style={[styles.backdrop, { backgroundColor: colors.overlay }]}
          accessibilityRole="button"
          accessibilityLabel={cancelLabel}
          disabled={loading}
          onPress={loading ? undefined : onCancel}
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
          <View
            style={[
              styles.iconWrap,
              { backgroundColor: colors.errorMuted },
            ]}
          >
            <Trash2 size={22} color={colors.error} strokeWidth={1.75} />
          </View>
          <Text variant="headingSmall">{title}</Text>
          {body ? (
            <Text variant="bodySmall" tone="secondary" className="mt-2">
              {body}
            </Text>
          ) : null}
          <View className="mt-5 gap-2">
            <Button
              label={confirmLabel}
              variant="destructive"
              loading={loading}
              disabled={loading}
              onPress={onConfirm}
              fullWidth
            />
            <Button
              label={cancelLabel}
              variant="secondary"
              disabled={loading}
              onPress={onCancel}
              fullWidth
            />
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
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[3],
  },
});
