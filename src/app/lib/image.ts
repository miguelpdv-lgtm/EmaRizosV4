// Reduce y comprime una foto en el navegador antes de subirla (fotos de celular de 5–10 MB → ~150 KB).
const MAX_SIDE = 1200;
const QUALITY = 0.85;
export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_ORIGINAL_BYTES = 25 * 1024 * 1024;

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ("createImageBitmap" in window) {
    try {
      // imageOrientation respeta la rotación EXIF de las fotos del celular
      return await createImageBitmap(file, { imageOrientation: "from-image" } as ImageBitmapOptions);
    } catch {
      /* algunos navegadores no aceptan opciones: se usa <img> */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/** Devuelve un File WebP (o JPEG si el navegador no codifica WebP) de máximo 1200 px. */
export async function compressImage(file: File): Promise<File> {
  const source = await loadBitmap(file);
  const w = "naturalWidth" in source ? source.naturalWidth : source.width;
  const h = "naturalHeight" in source ? source.naturalHeight : source.height;
  const scale = Math.min(1, MAX_SIDE / Math.max(w, h));
  const width = Math.max(1, Math.round(w * scale));
  const height = Math.max(1, Math.round(h * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, width, height);
  if ("close" in source) source.close();

  let blob = await toBlob(canvas, "image/webp", QUALITY);
  if (!blob || blob.type !== "image/webp") {
    // Safari antiguo: no genera WebP. JPEG con fondo blanco (sin transparencia).
    ctx.globalCompositeOperation = "destination-over";
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    blob = await toBlob(canvas, "image/jpeg", QUALITY);
  }
  if (!blob || blob.size >= file.size) return file; // si no mejora, se sube el original
  const ext = blob.type === "image/webp" ? "webp" : "jpg";
  const base = file.name.replace(/\.[^.]+$/, "") || "imagen";
  return new File([blob], `${base}.${ext}`, { type: blob.type });
}

/** Valida tipo y tamaño. Devuelve un mensaje de error o null. */
export function validateImage(file: File): string | null {
  if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return "La imagen debe ser JPG, PNG o WebP.";
  if (file.size > MAX_ORIGINAL_BYTES) return "La imagen pesa más de 25 MB.";
  return null;
}
