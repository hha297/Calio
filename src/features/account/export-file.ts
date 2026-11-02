import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Share } from 'react-native';

/** Write JSON to cache and open the system share sheet (Share.share fallback). */
export async function shareJsonFile(filename: string, json: string): Promise<void> {
  const file = new File(Paths.cache, filename);
  file.create({ overwrite: true });
  await file.write(json);

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/json',
      dialogTitle: filename,
      UTI: 'public.json',
    });
    return;
  }

  await Share.share({
    message: json,
    title: filename,
  });
}

export function backupFilenameForDate(date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `calio-backup-${yyyy}-${mm}-${dd}.json`;
}
