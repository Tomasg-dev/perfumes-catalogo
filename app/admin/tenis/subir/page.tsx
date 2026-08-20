"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { compressImage, nombreDesdeArchivo } from "@/lib/image-compress";
import { slugify } from "@/lib/slugify";
import { COLORES_TENIS } from "@/lib/colores-tenis";
import { GOLD_CHEVRON_STYLE, SELECT_OPTION_CLASSNAME } from "@/lib/select-style";
import ImageZoom from "@/components/ImageZoom";
import { createTenisBatch, type NuevoTenis } from "../../actions";
import type { CategoriaTenis } from "@/lib/types";

interface Borrador {
  key: string;
  file: File;
  previewUrl: string;
  nombre: string;
  categoria: CategoriaTenis;
  color: string;
  precio: string;
}

export default function SubirTenisPage() {
  const router = useRouter();
  const [borradores, setBorradores] = useState<Borrador[]>([]);
  const [publicando, setPublicando] = useState(false);
  const [progreso, setProgreso] = useState({ hecho: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);

  function handleFiles(files: FileList | null) {
    if (!files) return;
    const nuevos: Borrador[] = Array.from(files).map((file) => ({
      key: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      previewUrl: URL.createObjectURL(file),
      nombre: nombreDesdeArchivo(file.name),
      categoria: "hombre",
      color: "",
      precio: "",
    }));
    setBorradores((prev) => [...prev, ...nuevos]);
  }

  function actualizar(key: string, campo: keyof Borrador, valor: string) {
    setBorradores((prev) =>
      prev.map((b) => (b.key === key ? { ...b, [campo]: valor } : b))
    );
  }

  function quitar(key: string) {
    setBorradores((prev) => prev.filter((b) => b.key !== key));
  }

  async function publicar() {
    setError(null);
    setPublicando(true);
    setProgreso({ hecho: 0, total: borradores.length });

    try {
      const supabase = createClient();
      const items: NuevoTenis[] = [];

      for (const b of borradores) {
        const blob = await compressImage(b.file);
        const path = `${Date.now()}-${slugify(b.nombre)}.webp`;

        const { error: uploadError } = await supabase.storage
          .from("tenis")
          .upload(path, blob, { contentType: "image/webp" });
        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from("tenis").getPublicUrl(path);

        items.push({
          nombre: b.nombre,
          categoria: b.categoria,
          color: (b.color || null) as NuevoTenis["color"],
          precio: b.precio ? Number(b.precio) : null,
          imagenUrl: publicUrl,
        });

        setProgreso((p) => ({ ...p, hecho: p.hecho + 1 }));
      }

      await createTenisBatch(items);
      router.push("/admin/tenis");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ocurrió un error al publicar");
      setPublicando(false);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl text-[var(--color-ink)]">Subir tenis</h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">
        Selecciona varias fotos, completa nombre/categoría/precio de cada una y
        publica todo de una vez.
      </p>

      <label className="mt-6 flex w-fit cursor-pointer items-center gap-2 rounded-full border border-[var(--color-ink)] px-6 py-2.5 text-sm tracking-wide text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]">
        Elegir imágenes
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>

      {borradores.length > 0 && (
        <div className="mt-8 flex flex-col gap-4">
          {borradores.map((b) => (
            <div
              key={b.key}
              className="flex flex-col gap-3 border-b border-[var(--color-border)] pb-4 sm:flex-row sm:items-center"
            >
              <ImageZoom src={b.previewUrl} alt={b.nombre || "Vista previa"} className="h-24 w-24 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.previewUrl}
                  alt=""
                  className="h-24 w-24 shrink-0 rounded object-cover"
                />
              </ImageZoom>
              <div className="grid flex-1 grid-cols-1 gap-2 sm:grid-cols-4">
                <input
                  type="text"
                  value={b.nombre}
                  onChange={(e) => actualizar(b.key, "nombre", e.target.value)}
                  placeholder="Nombre / referencia"
                  className="rounded border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
                />
                <select
                  value={b.categoria}
                  onChange={(e) => actualizar(b.key, "categoria", e.target.value)}
                  className="appearance-none rounded border border-[var(--color-border)] bg-[var(--color-paper)] bg-[length:14px] bg-[right_0.75rem_center] bg-no-repeat py-2 pl-3 pr-8 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-gold)]"
                  style={GOLD_CHEVRON_STYLE}
                >
                  <option value="hombre" className={SELECT_OPTION_CLASSNAME}>
                    Hombre
                  </option>
                  <option value="mujer" className={SELECT_OPTION_CLASSNAME}>
                    Mujer
                  </option>
                  <option value="unisex" className={SELECT_OPTION_CLASSNAME}>
                    Unisex
                  </option>
                </select>
                <select
                  value={b.color}
                  onChange={(e) => actualizar(b.key, "color", e.target.value)}
                  className="appearance-none rounded border border-[var(--color-border)] bg-[var(--color-paper)] bg-[length:14px] bg-[right_0.75rem_center] bg-no-repeat py-2 pl-3 pr-8 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-gold)]"
                  style={GOLD_CHEVRON_STYLE}
                >
                  <option value="" className={SELECT_OPTION_CLASSNAME}>
                    Color (opcional)
                  </option>
                  {COLORES_TENIS.map((c) => (
                    <option key={c} value={c} className={SELECT_OPTION_CLASSNAME}>
                      {c[0].toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  min={0}
                  value={b.precio}
                  onChange={(e) => actualizar(b.key, "precio", e.target.value)}
                  placeholder="Precio (vacío = consultar)"
                  className="rounded border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
                />
              </div>
              <button
                type="button"
                onClick={() => quitar(b.key)}
                className="shrink-0 text-sm text-[var(--color-muted)] hover:text-red-600"
              >
                Quitar
              </button>
            </div>
          ))}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="button"
            onClick={publicar}
            disabled={publicando}
            className="mt-2 w-fit rounded-full border border-[var(--color-gold)] bg-[var(--color-gold)] px-6 py-2.5 text-sm tracking-wide text-[var(--color-paper)] transition-colors disabled:opacity-50"
          >
            {publicando
              ? `Publicando ${progreso.hecho}/${progreso.total}...`
              : `Publicar ${borradores.length} tenis`}
          </button>
        </div>
      )}
    </div>
  );
}
