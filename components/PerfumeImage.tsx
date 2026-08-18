"use client";

import { useRef, useState, useLayoutEffect } from "react";
import Image from "next/image";

interface PerfumeImageProps {
  imagenUrl: string | null;
  nombre: string;
  marca: string;
  priority?: boolean;
  sizes?: string;
}

const DEFAULT_SIZES = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw";

export default function PerfumeImage({
  imagenUrl,
  nombre,
  marca,
  priority = false,
  sizes = DEFAULT_SIZES,
}: PerfumeImageProps) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const showImage = imagenUrl && !failed;

  // Si la imagen ya falló antes de que React termine de hidratar, el evento
  // "error" nativo del navegador puede dispararse antes de que el onError de
  // React quede conectado. Esta verificación al montar detecta ese caso y
  // evita que quede un ícono de imagen rota en pantalla.
  useLayoutEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setFailed(true);
    }
  }, [imagenUrl]);

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden bg-[var(--color-paper-alt)]">
      {showImage ? (
        <Image
          ref={imgRef}
          src={imagenUrl}
          alt={`${marca} ${nombre}`}
          fill
          sizes={sizes}
          preload={priority}
          onError={() => setFailed(true)}
          className="object-cover"
        />
      ) : (
        <BottlePlaceholder />
      )}
    </div>
  );
}

function BottlePlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <svg
        viewBox="0 0 120 160"
        className="h-2/3 w-auto text-[var(--color-gold)] opacity-60"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <rect x="48" y="10" width="24" height="16" rx="2" />
        <rect x="52" y="6" width="16" height="6" rx="1" />
        <path d="M42 26 h36 l6 14 v96 a6 6 0 0 1 -6 6 h-36 a6 6 0 0 1 -6 -6 v-96 z" />
        <line x1="36" y1="70" x2="84" y2="70" />
      </svg>
    </div>
  );
}
