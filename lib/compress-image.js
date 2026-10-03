// Resizes and re-compresses an image file in the browser before upload, so
// phone photos (often several MB, 3000px+ wide) take a fraction of the
// storage/bandwidth without any visible quality loss at the sizes the site
// actually displays them. Pure canvas — no extra dependency.
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.85;

export async function compressImage(file) {
  if (!file.type.startsWith("image/")) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close?.();

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY));
    if (!blob) return file;

    // Only use the compressed version if it's actually smaller — a small
    // already-optimized image shouldn't get re-encoded into something bigger.
    if (blob.size >= file.size) return file;

    const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], newName, { type: "image/jpeg" });
  } catch {
    // Any failure (unsupported format, browser quirk) — just upload the
    // original rather than blocking the admin from adding the product.
    return file;
  }
}
