import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Screen } from '@/components/ui/screen';
import { Text } from '@/components/ui/text';
import { useCreateManualFood, useLogFoodEntry } from '@/features/food/hooks';
import { fetchOpenFoodFactsByBarcode, type CalioFood } from '@/features/food/open-food-facts';
import { toDiaryDateKey } from '@/utils/date';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [food, setFood] = useState<CalioFood | null>(null);
  const lastCode = useRef<string | null>(null);
  const createFood = useCreateManualFood();
  const logFood = useLogFoodEntry();

  if (!permission) {
    return (
      <Screen>
        <Text variant="body">Checking camera permission…</Text>
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen>
        <View className="flex-1 justify-center gap-4">
          <Text variant="headingLarge">Camera access</Text>
          <Text variant="body" tone="secondary">
            Calio needs the camera to read food barcodes. You can still add foods manually.
          </Text>
          <Button label="Allow camera" onPress={() => void requestPermission()} />
          <Button label="Add food manually" variant="ghost" onPress={() => router.push('/food/add')} />
        </View>
      </Screen>
    );
  }

  async function handleBarcode(barcode: string) {
    if (busy || lastCode.current === barcode) return;
    lastCode.current = barcode;
    setBusy(true);
    setMessage(null);
    try {
      const result = await fetchOpenFoodFactsByBarcode(barcode);
      if (!result) {
        setMessage('Unknown barcode. Try manual entry.');
        setFood(null);
        return;
      }
      setFood(result);
      setMessage(`Found ${result.name}`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Lookup failed.');
      setFood(null);
    } finally {
      setBusy(false);
      setTimeout(() => {
        lastCode.current = null;
      }, 1500);
    }
  }

  async function confirmFood() {
    if (!food) return;
    setBusy(true);
    try {
      const saved = await createFood.mutateAsync({
        name: food.name,
        brand: food.brand ?? undefined,
        barcode: food.barcode ?? undefined,
        servingLabel: food.servingLabel,
        calories: food.calories,
        proteinG: food.proteinG,
        carbsG: food.carbsG,
        fatG: food.fatG,
      });
      await logFood.mutateAsync({
        dateKey: toDiaryDateKey(),
        mealType: 'snacks',
        quantity: 1,
        food: {
          id: saved.id,
          name: saved.name,
          brand: saved.brand,
          servingLabel: saved.serving_label,
          calories: saved.calories,
          proteinG: saved.protein_g,
          carbsG: saved.carbs_g,
          fatG: saved.fat_g,
        },
      });
      router.replace('/(tabs)/index');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not save scanned food.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'code128'] }}
        onBarcodeScanned={busy ? undefined : ({ data }) => void handleBarcode(data)}
      />
      <View className="absolute bottom-0 left-0 right-0 gap-3 bg-black/70 px-4 pb-10 pt-4">
        <Text variant="body" tone="onPrimary" className="text-center">
          Align the barcode in the frame
        </Text>
        {message ? (
          <Text variant="bodySmall" tone="onPrimary" className="text-center">
            {message}
          </Text>
        ) : null}
        {food ? (
          <Button
            label={`Log ${food.name}`}
            loading={busy}
            onPress={() => {
              void confirmFood();
            }}
          />
        ) : null}
        <Pressable onPress={() => router.push('/food/add')}>
          <Text variant="bodyStrong" tone="onPrimary" className="text-center">
            Enter manually
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
