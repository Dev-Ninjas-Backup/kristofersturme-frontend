const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string;

const WEBP_QUALITY = 0.85;
const MAX_DIMENSION = 512; // cap avatar resolution to keep file sizes tiny

/** Convert any image File to a WebP Blob via an off-screen canvas. */
const toWebP = (file: File): Promise<Blob> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);

      // Scale down if larger than MAX_DIMENSION while keeping aspect ratio
      let { width, height } = img;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width >= height) {
          height = Math.round((height / width) * MAX_DIMENSION);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width / height) * MAX_DIMENSION);
          height = MAX_DIMENSION;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        blob => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas toBlob returned null'));
        },
        'image/webp',
        WEBP_QUALITY,
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image for conversion'));
    };
    img.src = URL.createObjectURL(file);
  });

export const uploadAvatar = async (file: File): Promise<string> => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error(
      'Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.',
    );
  }

  // Convert to WebP before uploading (smaller payload, faster CDN delivery)
  const webpBlob = await toWebP(file);
  const webpFile = new File([webpBlob], 'avatar.webp', { type: 'image/webp' });

  const form = new FormData();
  form.append('file', webpFile);
  form.append('upload_preset', UPLOAD_PRESET);
  form.append('folder', 'avatars');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: { message?: string } }).error?.message ?? 'Upload failed');
  }

  const data = (await res.json()) as { secure_url: string };
  return data.secure_url;
};
