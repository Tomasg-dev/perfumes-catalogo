export async function compressImage(
  file: File,
  maxWidth = 800,
  quality = 0.8
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No se pudo crear el contexto de canvas");
  ctx.drawImage(bitmap, 0, 0, width, height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("No se pudo comprimir la imagen"))),
      "image/webp",
      quality
    );
  });
}

export function nombreDesdeArchivo(filename: string): string {
  const sinExtension = filename.replace(/\.[^.]+$/, "");
  const palabras = sinExtension.replace(/[-_]+/g, " ").trim().split(/\s+/);
  return palabras
    .map((p) => (p ? p[0].toUpperCase() + p.slice(1).toLowerCase() : p))
    .join(" ");
}
