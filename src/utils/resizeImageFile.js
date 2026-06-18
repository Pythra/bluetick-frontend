export async function resizeImageFile(
  file,
  { maxWidth = 420, maxHeight = 96, outputType = 'image/png', quality = 0.92 } = {}
) {
  if (!file?.type?.startsWith('image/') || file.type.includes('svg')) {
    return file;
  }

  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = objectUrl;
    });

    const scale = Math.min(1, maxWidth / image.width, maxHeight / image.height);
    if (scale >= 1) {
      return file;
    }

    const width = Math.max(1, Math.round(image.width * scale));
    const height = Math.max(1, Math.round(image.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      return file;
    }

    context.drawImage(image, 0, 0, width, height);

    const blob = await new Promise((resolve) => {
      canvas.toBlob(resolve, outputType, quality);
    });

    if (!blob) {
      return file;
    }

    const extension = outputType === 'image/jpeg' ? 'jpg' : 'png';
    return new File([blob], file.name.replace(/\.[^.]+$/, `.${extension}`), {
      type: outputType,
      lastModified: Date.now(),
    });
  } catch {
    return file;
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
