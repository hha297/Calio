import { router, useLocalSearchParams } from 'expo-router';
import { Star } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState, LoadingState } from '@/components/ui/states';
import {
  WORKOUT_CATEGORY_TAGS,
  WORKOUT_CATEGORY_TO_TYPE,
  WORKOUT_IMAGE_CATEGORIES,
  type ImageWorkoutCategory,
} from '@/features/workout/category-assets';
import {
  useExerciseFavorites,
  useExercises,
  useTemplateExercises,
  useToggleExerciseFavorite,
  useWorkoutTemplates,
} from '@/features/workout/hooks';
import { radii } from '@/theme';
import { useThemeColors } from '@/theme/theme-provider';
import { useActiveWorkoutStore } from '@/stores/active-workout-store';

const IMAGE_CATEGORY_IDS = new Set<string>(WORKOUT_IMAGE_CATEGORIES);

function parseCategory(value: string | undefined): ImageWorkoutCategory | null {
  if (value && IMAGE_CATEGORY_IDS.has(value)) {
    return value as ImageWorkoutCategory;
  }
  return null;
}

export default function ExercisePickerScreen() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const params = useLocalSearchParams<{ category?: string }>();
  const [term, setTerm] = useState('');
  const [category, setCategory] = useState<ImageWorkoutCategory | null>(() =>
    parseCategory(params.category),
  );
  const [tag, setTag] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<string | null>(null);

  useEffect(() => {
    const next = parseCategory(params.category);
    if (next) {
      setCategory(next);
      setTag(null);
      setPreviewId(null);
    }
  }, [params.category]);

  const exerciseType = category ? WORKOUT_CATEGORY_TO_TYPE[category] : null;
  const categoryTags = category ? WORKOUT_CATEGORY_TAGS[category] : null;

  const exercises = useExercises({
    search: term,
    category: null,
    exerciseType,
    muscle: categoryTags?.kind === 'muscle' ? tag : null,
  });
  const templates = useWorkoutTemplates();
  const previewExercises = useTemplateExercises(previewId);
  const favorites = useExerciseFavorites();
  const toggleFavorite = useToggleExerciseFavorite();
  const startedAt = useActiveWorkoutStore((state) => state.startedAt);
  const addExercise = useActiveWorkoutStore((state) => state.addExercise);
  const start = useActiveWorkoutStore((state) => state.start);
  const favoriteIds = useMemo(() => new Set(favorites.data ?? []), [favorites.data]);

  const categoryTemplates = useMemo(() => {
    if (!category) return [];
    return (templates.data ?? []).filter((item) => item.category === category);
  }, [templates.data, category]);

  const sorted = useMemo(() => {
    let list = exercises.data ?? [];
    if (categoryTags?.kind === 'equipment' && tag) {
      list = list.filter((exercise) => (exercise.equipment ?? 'none') === tag);
    }
    return [...list].sort((a, b) => {
      const af = favoriteIds.has(a.id) ? 0 : 1;
      const bf = favoriteIds.has(b.id) ? 0 : 1;
      if (af !== bf) return af - bf;
      return a.name.localeCompare(b.name);
    });
  }, [exercises.data, favoriteIds, categoryTags, tag]);

  const pickExercise = (exercise: (typeof sorted)[number]) => {
    if (!startedAt) {
      start({ name: t('workout.defaultName') });
    }
    addExercise({
      exerciseId: exercise.id,
      name: exercise.name,
      exerciseType: exercise.exercise_type,
      metValue: exercise.met_value,
      primaryMuscles: exercise.primary_muscles,
    });
    router.replace('/workout/active');
  };

  const startFromTemplate = (templateId: string, name: string) => {
    const exercisesForTemplate =
      previewId === templateId ? previewExercises.data : undefined;
    if (!exercisesForTemplate) {
      setPreviewId(templateId);
      return;
    }
    start({
      name,
      sourceTemplateId: templateId,
      exercises: exercisesForTemplate.map((item) => ({
        exerciseId: item.exercise_id,
        name: item.exercise_name,
        exerciseType: item.exercise_type,
        metValue: null,
        plannedSets: item.planned_sets,
        plannedReps: item.planned_reps,
      })),
    });
    router.push('/workout/active');
  };

  return (
    <Screen scroll keyboard edges={['top', 'bottom', 'left', 'right']}>
      <View className="gap-4">
        <View className="flex-row items-center justify-between">
          <View className="min-w-0 flex-1 gap-1">
            <Text variant="headingLarge">
              {category ? t(`workout.category.${category}`) : t('workout.library')}
            </Text>
            {category ? (
              <Text variant="bodySmall" tone="secondary">
                {t(`workout.categorySubtitle.${category}`)}
              </Text>
            ) : null}
          </View>
          <Pressable onPress={() => router.back()}>
            <Text variant="bodyStrong" tone="brand">
              {t('workout.done')}
            </Text>
          </Pressable>
        </View>

        <Input
          label={t('workout.search')}
          value={term}
          onChangeText={setTerm}
          autoCapitalize="none"
        />

        {!category ? (
          <View className="flex-row flex-wrap gap-2">
            {WORKOUT_IMAGE_CATEGORIES.map((item) => (
              <Pressable
                key={item}
                onPress={() => {
                  setCategory(item);
                  setTag(null);
                  router.setParams({ category: item });
                }}
                className="px-3 py-2"
                style={{
                  borderRadius: radii.pill,
                  backgroundColor: colors.surfaceMuted,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <Text variant="caption" tone="secondary">
                  {t(`workout.category.${item}`)}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        {category && categoryTags ? (
          <View className="flex-row flex-wrap gap-2">
            <Pressable
              onPress={() => setTag(null)}
              className="px-3 py-2"
              style={{
                borderRadius: radii.pill,
                backgroundColor: tag == null ? colors.primaryMuted : colors.surfaceMuted,
                borderWidth: tag == null ? 1.5 : 1,
                borderColor: tag == null ? colors.primary : colors.border,
              }}
            >
              <Text variant="caption" tone={tag == null ? 'brand' : 'secondary'}>
                {t('workout.filterAll')}
              </Text>
            </Pressable>
            {categoryTags.values.map((value) => {
              const selected = tag === value;
              const label =
                categoryTags.kind === 'muscle'
                  ? t(`workout.muscle.${value}`, { defaultValue: value })
                  : t(`workout.equipment.${value}`, { defaultValue: value });
              return (
                <Pressable
                  key={value}
                  onPress={() => setTag(selected ? null : value)}
                  className="px-3 py-2"
                  style={{
                    borderRadius: radii.pill,
                    backgroundColor: selected ? colors.primaryMuted : colors.surfaceMuted,
                    borderWidth: selected ? 1.5 : 1,
                    borderColor: selected ? colors.primary : colors.border,
                  }}
                >
                  <Text variant="caption" tone={selected ? 'brand' : 'secondary'}>
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}

        {category ? (
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text variant="label" tone="secondary">
                {t('workout.templates')}
              </Text>
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/workout/templates/create',
                    params: { category },
                  })
                }
              >
                <Text variant="caption" tone="brand">
                  {t('workout.createTemplate')}
                </Text>
              </Pressable>
            </View>
            {templates.isLoading ? <LoadingState /> : null}
            {templates.error ? (
              <ErrorState
                title={t('workout.templatesError')}
                body={
                  templates.error instanceof Error
                    ? templates.error.message
                    : t('workout.retry')
                }
                onRetry={() => void templates.refetch()}
              />
            ) : null}
            {!templates.isLoading && categoryTemplates.length === 0 ? (
              <Text variant="caption" tone="muted">
                {t('workout.emptyHistoryBody')}
              </Text>
            ) : null}
            {categoryTemplates.map((template) => {
              const open = previewId === template.id;
              return (
                <Card key={template.id} className="gap-2">
                  <Pressable onPress={() => setPreviewId(open ? null : template.id)}>
                    <Text variant="bodyStrong">{template.name}</Text>
                    <Text variant="caption" tone="secondary">
                      {template.is_system ? t('workout.systemTemplate') : t('workout.custom')}
                    </Text>
                    {template.description ? (
                      <Text variant="caption" tone="muted" numberOfLines={2}>
                        {template.description}
                      </Text>
                    ) : null}
                  </Pressable>
                  {open ? (
                    <View className="gap-2">
                      {previewExercises.isLoading ? <LoadingState /> : null}
                      {(previewExercises.data ?? []).map((item) => (
                        <Text key={item.id} variant="caption" tone="secondary">
                          {item.exercise_name}
                          {item.planned_sets
                            ? ` · ${item.planned_sets}×${item.planned_reps ?? '—'}`
                            : ''}
                        </Text>
                      ))}
                      <Button
                        label={t('workout.startTemplate')}
                        onPress={() => startFromTemplate(template.id, template.name)}
                        disabled={previewExercises.isLoading}
                      />
                    </View>
                  ) : null}
                </Card>
              );
            })}
          </View>
        ) : null}

        <Button
          label={t('workout.createCustom')}
          onPress={() => router.push('/workout/exercises/create')}
        />

        {exercises.isLoading ? <LoadingState /> : null}
        {exercises.error ? (
          <ErrorState
            title={t('workout.libraryError')}
            body={
              exercises.error instanceof Error ? exercises.error.message : t('workout.retry')
            }
            onRetry={() => void exercises.refetch()}
          />
        ) : null}

        {!exercises.isLoading && sorted.length === 0 ? (
          <View className="gap-3">
            <EmptyState title={t('workout.noExercises')} body={t('workout.noExercisesBody')} />
            <Button
              label={t('workout.createCustom')}
              onPress={() => router.push('/workout/exercises/create')}
            />
          </View>
        ) : null}

        {sorted.map((exercise) => {
          const fav = favoriteIds.has(exercise.id);
          return (
            <Card key={exercise.id} className="gap-2">
              <Pressable
                onPress={() => {
                  try {
                    pickExercise(exercise);
                  } catch (error) {
                    Alert.alert(
                      t('workout.saveFailed'),
                      error instanceof Error ? error.message : t('workout.retry'),
                    );
                  }
                }}
              >
                <Text variant="bodyStrong">{exercise.name}</Text>
                <Text variant="caption" tone="secondary">
                  {t(`workout.type.${exercise.exercise_type}`)}
                  {exercise.equipment ? ` · ${exercise.equipment}` : ''}
                  {exercise.is_system ? '' : ` · ${t('workout.custom')}`}
                </Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  void toggleFavorite.mutateAsync({
                    exerciseId: exercise.id,
                    favorite: !fav,
                  })
                }
                className="flex-row items-center gap-1 self-start"
              >
                <Star
                  size={14}
                  color={fav ? colors.primary : colors.textMuted}
                  fill={fav ? colors.primary : 'transparent'}
                />
                <Text variant="caption" tone={fav ? 'brand' : 'secondary'}>
                  {fav ? t('workout.favorited') : t('workout.favorite')}
                </Text>
              </Pressable>
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}
