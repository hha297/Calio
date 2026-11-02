import { Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { radii, spacing } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';

import { getFieldCursorProps, getFieldTypography } from './field-styles';

type DeleteConfirmDialogProps = {
  visible: boolean;
  title: string;
  body?: string;
  cancelLabel: string;
  confirmLabel: string;
  loading?: boolean;
  /** When set, confirm stays disabled until the user types this exact phrase. */
  confirmPhrase?: string;
  confirmPhraseLabel?: string;
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
  confirmPhrase,
  confirmPhraseLabel,
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
      {/* Remount body when opened so typed confirm phrases reset without an effect. */}
      {visible ? (
        <DeleteConfirmDialogBody
          key="open"
          title={title}
          body={body}
          cancelLabel={cancelLabel}
          confirmLabel={confirmLabel}
          loading={loading}
          confirmPhrase={confirmPhrase}
          confirmPhraseLabel={confirmPhraseLabel}
          onCancel={onCancel}
          onConfirm={onConfirm}
          colors={colors}
        />
      ) : null}
    </Modal>
  );
}

function DeleteConfirmDialogBody({
  title,
  body,
  cancelLabel,
  confirmLabel,
  loading,
  confirmPhrase,
  confirmPhraseLabel,
  onCancel,
  onConfirm,
  colors,
}: {
  title: string;
  body?: string;
  cancelLabel: string;
  confirmLabel: string;
  loading: boolean;
  confirmPhrase?: string;
  confirmPhraseLabel?: string;
  onCancel: () => void;
  onConfirm: () => void;
  colors: ReturnType<typeof useThemeColors>;
}) {
  const [phrase, setPhrase] = useState('');
  const phraseOk = !confirmPhrase || phrase.trim() === confirmPhrase;
  const confirmDisabled = loading || !phraseOk;

  return (
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
        <View style={[styles.iconWrap, { backgroundColor: colors.errorMuted }]}>
          <Trash2 size={22} color={colors.error} strokeWidth={1.75} />
        </View>
        <Text variant="headingSmall">{title}</Text>
        {body ? (
          <Text variant="bodySmall" tone="secondary" className="mt-2">
            {body}
          </Text>
        ) : null}
        {confirmPhrase ? (
          <View className="mt-4 gap-2">
            <Text variant="label" tone="secondary">
              {confirmPhraseLabel ?? confirmPhrase}
            </Text>
            <TextInput
              value={phrase}
              onChangeText={setPhrase}
              editable={!loading}
              autoCapitalize="characters"
              autoCorrect={false}
              accessibilityLabel={confirmPhraseLabel ?? confirmPhrase}
              placeholder={confirmPhrase}
              placeholderTextColor={colors.textMuted}
              {...getFieldCursorProps(colors)}
              style={[
                {
                  ...getFieldTypography(colors),
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: radii.md,
                  paddingHorizontal: spacing[3],
                  paddingVertical: spacing[2],
                  backgroundColor: colors.background,
                },
              ]}
            />
          </View>
        ) : null}
        <View className="mt-5 gap-2">
          <Button
            label={confirmLabel}
            variant="destructive"
            loading={loading}
            disabled={confirmDisabled}
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
