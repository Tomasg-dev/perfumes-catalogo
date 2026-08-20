"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { GOLD_CHEVRON_STYLE, SELECT_OPTION_CLASSNAME } from "@/lib/select-style";
import ImageZoom from "@/components/ImageZoom";
import type { PerfumeAdmin } from "@/lib/types";
import { updatePerfume, deletePerfume } from "../actions";

export default function PerfumesList({ perfumes }: { perfumes: PerfumeAdmin[] }) {
  const [busqueda, setBusqueda] = useState("");

  const visibles = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return perfumes;
    return perfumes.filter(
      (p) => p.nombre.toLowerCase().includes(q) || p.marca.toLowerCase().includes(q)
    );
  }, [perfumes, busqueda]);

  return (
    <div>
      <input
        type="search"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar por nombre o marca"
        className="mt-6 w-full max-w-sm rounded-full border border-[var(--color-border)] bg-transparent px-4 py-1.5 text-sm outline-none focus:border-[var(--color-gold)]"
      />

      <p className="mt-3 text-xs text-[var(--color-muted)]">
        Mostrando {visibles.length} de {perfumes.length}
      </p>

      <div className="mt-4 flex flex-col gap-4">
        {visibles.map((p) => (
          <form
            key={p.id}
            action={updatePerfume.bind(null, p.id)}
            className="flex flex-col gap-3 border-b border-[var(--color-border)] pb-4 sm:flex-row sm:items-center"
          >
            {/* Campos editables solo en /admin/perfumes/[id] (descripción y notas);
                se reenvían tal cual para que "Guardar" no los borre. */}
            <input type="hidden" name="descripcion" defaultValue={p.descripcion} />
            <input type="hidden" name="notasSalida" defaultValue={p.notasSalida.join(", ")} />
            <input type="hidden" name="notasCorazon" defaultValue={p.notasCorazon.join(", ")} />
            <input type="hidden" name="notasFondo" defaultValue={p.notasFondo.join(", ")} />
            <input type="hidden" name="imagenUrl" defaultValue={p.imagenUrl ?? ""} />

            {p.imagenUrl ? (
              <ImageZoom src={p.imagenUrl} alt={p.nombre} className="h-20 w-20 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.imagenUrl}
                  alt={p.nombre}
                  className="h-20 w-20 shrink-0 rounded object-cover"
                />
              </ImageZoom>
            ) : (
              <div className="h-20 w-20 shrink-0 rounded bg-[var(--color-paper-alt)]" />
            )}

            <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-6">
              <input
                type="text"
                name="nombre"
                defaultValue={p.nombre}
                placeholder="Nombre"
                className="rounded border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)] sm:col-span-2"
              />
              <input
                type="text"
                name="marca"
                defaultValue={p.marca}
                placeholder="Marca"
                className="rounded border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
              />
              <select
                name="categoria"
                defaultValue={p.categoria}
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
              <input
                type="number"
                name="precio"
                min={0}
                defaultValue={p.precio ?? ""}
                placeholder={formatPrice(null)}
                className="rounded border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
              />
              <input
                type="number"
                name="ml"
                min={0}
                defaultValue={p.ml}
                placeholder="ml"
                className="rounded border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
              />
            </div>

            <div className="flex flex-col justify-center gap-1 text-sm text-[var(--color-ink)]">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="activo" defaultChecked={p.activo} />
                Visible
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="destacado" defaultChecked={p.destacado} />
                Destacado
              </label>
            </div>

            <div className="flex shrink-0 flex-wrap gap-2">
              <Link
                href={`/admin/perfumes/${p.id}`}
                className="flex items-center rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
              >
                Detalles
              </Link>
              <button
                type="submit"
                className="rounded-full border border-[var(--color-gold)] px-4 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-gold)] hover:text-[var(--color-paper)]"
              >
                Guardar
              </button>
              <button
                formAction={deletePerfume.bind(null, p.id)}
                className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-muted)] hover:border-red-600 hover:text-red-600"
              >
                Borrar
              </button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
