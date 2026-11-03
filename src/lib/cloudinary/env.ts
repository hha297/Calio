import Constants from 'expo-constants';

export type CloudinaryEnv = {
  cloudName: string;
  uploadPreset: string;
};

type Extra = {
  cloudinaryCloudName?: string;
  cloudinaryUploadPreset?: string;
};

function readExtra(): Extra {
  return (Constants.expoConfig?.extra ?? {}) as Extra;
}

export function getCloudinaryEnv(): CloudinaryEnv | null {
  const extra = readExtra();
  const cloudName = (
    process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    extra.cloudinaryCloudName ||
    ''
  ).trim();
  const uploadPreset = (
    process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET ||
    extra.cloudinaryUploadPreset ||
    ''
  ).trim();

  if (!cloudName || !uploadPreset) {
    return null;
  }

  return { cloudName, uploadPreset };
}

export function isCloudinaryConfigured(): boolean {
  return getCloudinaryEnv() !== null;
}
