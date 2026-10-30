import { useImage, type ImageRef } from 'expo-image';
import {
  createContext,
  createElement,
  type ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';

import { useThemeColors } from '@/theme/theme-provider';

export const scanImageSource = require('../../../assets/icons/scan.gif');

type ScanImages = {
  active: ImageRef | null;
  inactive: ImageRef | null;
};

const ScanImageContext = createContext<ScanImages>({ active: null, inactive: null });

export function ScanImageProvider({ children }: { children: ReactNode }) {
  const colors = useThemeColors();
  const [activeFailed, setActiveFailed] = useState(false);
  const [inactiveFailed, setInactiveFailed] = useState(false);
  const handleActiveError = useCallback(() => setActiveFailed(true), []);
  const handleInactiveError = useCallback(() => setInactiveFailed(true), []);
  const active = useImage(
    scanImageSource,
    {
      maxWidth: 150,
      maxHeight: 150,
      tintColor: colors.textOnPrimary,
      onError: handleActiveError,
    },
    [colors.textOnPrimary],
  );
  const inactive = useImage(
    scanImageSource,
    {
      maxWidth: 150,
      maxHeight: 150,
      tintColor: colors.textMuted,
      onError: handleInactiveError,
    },
    [colors.textMuted],
  );

  if ((!active && !activeFailed) || (!inactive && !inactiveFailed)) return null;

  return createElement(ScanImageContext.Provider, { value: { active, inactive } }, children);
}

export function useScanImages() {
  return useContext(ScanImageContext);
}
