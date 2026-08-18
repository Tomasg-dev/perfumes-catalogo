"use client";

import { useMemo, useState } from "react";
import PerfumeCard from "./PerfumeCard";
import type { Perfume, Categoria } from "@/lib/types";
import { CATEGORIA_LABELS } from "@/lib/format";

type Orden = "destacados" | "precio-asc" | "precio-desc";

const CATEGORIAS: (Categoria | "todos")[] = ["todos", "hombre", "mujer", "unisex"];

// Los perfumes con precio pendiente (null) siempre quedan al final,
// sin importar la dirección del orden.
function comparePrecio(a: number | null, b: number | null, direccion: 1 | -1): number {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return (a - b) * direccion;
}

export default function CatalogExplorer({ perfumes }: { perfumes: Perfume[] }) {
  const [categoria, setCategoria] = useState<Categoria | "todos">("todos");
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState<Orden>("destacados");

  const resultado = useMemo(() => {
    let lista = perfumes;

    if (categoria !== "todos") {
      lista = lista.filter((p) => p.categoria === categoria);
    }

    const q = busqueda.trim().toLowerCase();
    if (q) {
      lista = lista.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) || p.marca.toLowerCase().includes(q)
      );
    }

    const ordenada = [...lista];
    if (orden === "precio-asc") {
      ordenada.sort((a, b) => comparePrecio(a.precio, b.precio, 1));
    } else if (orden === "precio-desc") {
      ordenada.sort((a, b) => comparePrecio(a.precio, b.precio, -1));
    } else {
      ordenada.sort((a, b) => Number(b.destacado) - Number(a.destacado));
    }

    return ordenada;
  }, [perfumes, categoria, busqueda, orden]);

  return (
    <div>
      <div className="flex flex-col gap-6 border-b border-[var(--color-border)] pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategoria(c)}
              className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-widest transition-colors ${
                categoria === c
                  ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-paper)]"
                  : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
              }`}
            >
              {c === "todos" ? "Todos" : CATEGORIA_LABELS[c]}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre o marca"
            className="min-w-0 rounded-full border border-[var(--color-border)] bg-transparent px-4 py-1.5 text-sm outline-none focus:border-[var(--color-gold)] sm:w-56"
          />
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value as Orden)}
            className="min-w-0 appearance-none rounded-full border border-[var(--color-border)] bg-[var(--color-paper)] bg-[length:14px] bg-[right_1rem_center] bg-no-repeat pl-4 pr-9 py-1.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-gold)]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%23a9884f' stroke-width='1.5'%3E%3Cpath d='M5 7.5 10 12.5 15 7.5'/%3E%3C/svg%3E\")",
            }}
          >
            <option
              value="destacados"
              className="bg-[var(--color-paper)] text-[var(--color-ink)]"
            >
              Destacados
            </option>
            <option
              value="precio-asc"
              className="bg-[var(--color-paper)] text-[var(--color-ink)]"
            >
              Precio: menor a mayor
            </option>
            <option
              value="precio-desc"
              className="bg-[var(--color-paper)] text-[var(--color-ink)]"
            >
              Precio: mayor a menor
            </option>
          </select>
        </div>
      </div>

      {resultado.length === 0 ? (
        <p className="py-24 text-center text-sm text-[var(--color-muted)]">
          No encontramos perfumes que coincidan con tu búsqueda.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 py-10 sm:grid-cols-3 lg:grid-cols-4">
          {resultado.map((perfume) => (
            <PerfumeCard key={perfume.id} perfume={perfume} />
          ))}
        </div>
      )}
    </div>
  );
}
