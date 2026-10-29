import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ImagePlus, Trash2, RefreshCw } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

import { Text } from '@/components/ui/text';
import {
  assertFoodImageWithinSizeLimit,
  formatFoodImageSizeLimit,
  type SelectedFoodImage,
  validateFoodImageSelection,
} from '@/features/food/food-image';
import { iconSizes, radii, spacing } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';

type FoodImageFieldProps = {
  value: SelectedFoodImage | null;
  onChange: (next: SelectedFoodImage | null) => void;
  disabled?: boolean;
  /** Optional remote URL already saved (edit flows). */
  existingUrl?: string | null;
};

/**
 * Single food image picker for Create Food.
 * One image only · max 10 MB · library pick · local preview.
 */
export function FoodImageField({
  value,
  onChange,
  disabled = false,
  existingUrl = null,
}: FoodImageFieldProps) {
  const colors = useThemeColors();
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const previewUri = value?.uri ?? existingUrl ?? null;

  async function pickImage() {
    if (disabled || busy) return;
    setLocalError(null);
    setBusy(true);
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setLocalError('Photo library access is required to add a food image.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: false,
        quality: 0.85,
        exif: false,
      });

      if (result.canceled || !result.assets[0]) {
        return;
      }

      const asset = result.assets[0];
      let selected = validateFoodImageSelection({
        uri: asset.uri,
        mimeType: asset.mimeType,
        fileName: asset.fileName,
        fileSize: asset.fileSize,
      });
      selected = await assertFoodImageWithinSizeLimit(selected);
      onChange(selected);
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Could not select that image.');
    } finally {
      setBusy(false);
    }
  }

  function clearImage() {
    if (disabled || busy) return;
    setLocalError(null);
    onChange(null);
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text variant="label" tone="secondary" style={styles.headerTitle}>
          Food image (optional)
        </Text>
        <Text variant="caption" tone="muted" style={styles.headerHint}>
          1 photo · max {formatFoodImageSizeLimit()}
        </Text>
      </View>

      {previewUri ? (
        <View style={[styles.previewCard, { backgroundColor: colors.surfaceMuted }]}>
          <View style={styles.previewImageWrap}>
            <Image
              source={{ uri: previewUri }}
              style={[styles.previewImage, { backgroundColor: colors.surface }]}
              contentFit="cover"
              accessibilityLabel="Selected food image"
            />
          </View>
          <View style={styles.previewActions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Replace food image"
              disabled={disabled || busy}
              onPress={() => void pickImage()}
              style={({ pressed }) => [
                styles.actionChip,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <RefreshCw size={iconSizes.sm} color={colors.textPrimary} strokeWidth={2.25} />
              <Text variant="label" tone="primary">
                Replace
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Remove food image"
              disabled={disabled || busy}
              onPress={clearImage}
              style={({ pressed }) => [
                styles.actionChip,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Trash2 size={iconSizes.sm} color={colors.error} strokeWidth={2.25} />
              <Text variant="label" tone="error">
                Remove
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add food image"
          disabled={disabled || busy}
          onPress={() => void pickImage()}
          style={({ pressed }) => [
            styles.empty,
            {
              backgroundColor: colors.surfaceMuted,
              borderColor: colors.border,
              opacity: pressed || busy ? 0.85 : 1,
            },
          ]}
        >
          {busy ? (
            <ActivityIndicator color={colors.primary} />
          ) : (
            <View style={styles.emptyContent}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.primary }]}>
                <ImagePlus size={20} color={colors.textOnPrimary} strokeWidth={2.4} />
              </View>
              <Text variant="bodyStrong" style={styles.emptyTitle}>
                Add food image
              </Text>
              <Text variant="caption" tone="muted" style={styles.emptyHint}>
                Choose one JPEG, PNG, or WebP from your library
              </Text>
              <View style={styles.emptyMeta}>
                <Camera size={14} color={colors.textMuted} />
                <Text variant="caption" tone="muted">
                  Single image · {formatFoodImageSizeLimit()} max
                </Text>
              </View>
            </View>
          )}
        </Pressable>
      )}

      {localError ? (
        <Text variant="caption" tone="error" style={styles.error}>
          {localError}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing[3],
    width: '100%',
  },
  header: {
    gap: spacing[1],
    paddingRight: spacing[1],
  },
  headerTitle: {
    flexShrink: 1,
  },
  headerHint: {
    flexShrink: 1,
  },
  empty: {
    minHeight: 148,
    width: '100%',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: radii.md,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[5],
  },
  emptyContent: {
    width: '100%',
    alignItems: 'center',
    gap: spacing[2],
  },
  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[1],
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptyHint: {
    textAlign: 'center',
    paddingHorizontal: spacing[2],
  },
  emptyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: spacing[1],
  },
  previewCard: {
    width: '100%',
    borderRadius: radii.md,
    overflow: 'hidden',
  },
  previewImageWrap: {
    width: '100%',
    paddingHorizontal: spacing[3],
    paddingTop: spacing[3],
  },
  previewImage: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: radii.md,
  },
  previewActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[4],
    paddingHorizontal: spacing[3],
    paddingTop: spacing[4],
    paddingBottom: spacing[4],
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    minHeight: 44,
    minWidth: 120,
    flexGrow: 1,
    flexBasis: 0,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderRadius: radii.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  error: {
    marginTop: spacing[1],
  },
});
