import { Product } from '../types';

/**
 * Resizes and converts an uploaded image file on the client side using HTML5 Canvas to WebP format.
 * Generates lightweight, high-clarity WebP images to fit safely into Firestore or cloud storage.
 */
export async function optimizeImageToWebP(
  file: File,
  maxWidth = 800,
  maxHeight = 1200,
  quality = 0.78
): Promise<string> {
  return new Promise((resolve) => {
    if (!file) {
      resolve('');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (!dataUrl) {
        resolve('');
        return;
      }

      // If SVG or GIF, return as-is
      if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
        resolve(dataUrl);
        return;
      }

      try {
        const img = new Image();

        img.onload = () => {
          try {
            let width = img.naturalWidth || img.width;
            let height = img.naturalHeight || img.height;

            if (!width || !height) {
              resolve(dataUrl);
              return;
            }

            // Calculate new dimensions preserving exact aspect ratio without distortion
            let targetW = width;
            let targetH = height;

            if (targetW > maxWidth || targetH > maxHeight) {
              const ratio = Math.min(maxWidth / targetW, maxHeight / targetH);
              targetW = Math.round(targetW * ratio);
              targetH = Math.round(targetH * ratio);
            }

            const canvas = document.createElement('canvas');
            canvas.width = targetW;
            canvas.height = targetH;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              resolve(dataUrl);
              return;
            }

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, targetW, targetH);

            // Export as image/webp
            let webpResult = canvas.toDataURL('image/webp', quality);
            
            // Fallback to JPEG if WebP export is unsupported
            if (!webpResult.startsWith('data:image/webp')) {
              webpResult = canvas.toDataURL('image/jpeg', quality);
            }

            if (webpResult && webpResult.length > 50) {
              resolve(webpResult);
            } else {
              resolve(dataUrl);
            }
          } catch (canvasErr) {
            console.warn('Canvas processing error, falling back to original:', canvasErr);
            resolve(dataUrl);
          }
        };

        img.onerror = () => {
          resolve(dataUrl);
        };

        img.src = dataUrl;
      } catch (err) {
        console.warn('Image optimizer exception, fallback to raw:', err);
        resolve(dataUrl);
      }
    };

    reader.onerror = () => {
      resolve('');
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Legacy compatibility wrapper for optimizeImageFile
 */
export async function optimizeImageFile(
  file: File,
  maxDimension = 900,
  quality = 0.75
): Promise<string> {
  return optimizeImageToWebP(file, maxDimension, maxDimension, quality);
}

/**
 * Generates a WebP thumbnail (400 x 600 max) for catalog grid cards.
 */
export async function optimizeImageForCatalog(file: File): Promise<string> {
  return optimizeImageToWebP(file, 400, 600, 0.75);
}

/**
 * Generates a high-resolution WebP image (800 x 1200 max) for product detail modal.
 */
export async function optimizeImageForDetail(file: File): Promise<string> {
  return optimizeImageToWebP(file, 800, 1200, 0.80);
}

/**
 * Universal helper to resolve the exact photo assigned to a given color for a product.
 * Checks imageColors parallel array first, then colorImageMap.
 */
export function getProductImageForColor(
  product: Product | null | undefined,
  colorName: string | null | undefined
): string | undefined {
  if (!product || !colorName) return undefined;
  const target = colorName.trim().toLowerCase();

  // 1. Check imageColors array matching index with images array
  if (product.imageColors && product.images) {
    const idx = product.imageColors.findIndex(
      (c) => c && c.trim().toLowerCase() === target
    );
    if (idx !== -1 && product.images[idx]) {
      return product.images[idx];
    }
  }

  // 2. Check colorImageMap
  if (product.colorImageMap) {
    const matchingKey = Object.keys(product.colorImageMap).find(
      (k) => k.trim().toLowerCase() === target
    );
    if (matchingKey && product.colorImageMap[matchingKey]) {
      const val = product.colorImageMap[matchingKey];
      const num = parseInt(val, 10);
      if (!isNaN(num) && product.images && product.images[num]) {
        return product.images[num];
      }
      return val;
    }
  }

  // 3. Fallback to imageColorMap
  if (product.imageColorMap) {
    const entry = Object.entries(product.imageColorMap).find(
      ([_, c]) => c && c.trim().toLowerCase() === target
    );
    if (entry) return entry[0];
  }

  return undefined;
}
