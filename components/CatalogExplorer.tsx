"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import PerfumeCard from "./PerfumeCard";
import type { Perfume, Categoria } from "@/lib/types";
import { CATEGORIA_LABELS } from "@/lib/format";
import { GOLD_CHEVRON_STYLE, SELECT_OPTION_CLASSNAME } from "@/lib/select-style";

type Orden = "destacados" | "precio-asc" | "precio-desc";

const CATEGORIAS: (Categoria | "todos")[] = ["todos", "hombre", "mujer", "unisex"];
const PERFUMES_INICIAL = 36;
const PERFUMES_INCREMENTO = 36;

// Los perfumes con precio pendiente (null) siempre quedan al final,
// sin importar la dirección del orden.
function comparePrecio(a: number | null, b: number | null, direccion: 1 | -1): number {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  return (a - b) * direccion;
}

export default function CatalogExplorer({
  perfumes,
  initialCategoria = "todos",
  initialBusqueda = "",
  initialOrden = "destacados",
  initialVisibleCount = PERFUMES_INICIAL,
}: {
  perfumes: Perfume[];
  initialCategoria?: Categoria | "todos";
  initialBusqueda?: string;
  initialOrden?: Orden;
  initialVisibleCount?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [categoria, setCategoria] = useState<Categoria | "todos">(initialCategoria);
  const [busqueda, setBusqueda] = useState(initialBusqueda);
  const [orden, setOrden] = useState<Orden>(initialOrden);
  const [visibleCount, setVisibleCount] = useState(initialVisibleCount);

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

  function cambiarCategoria(c: Categoria | "todos") {
    setCategoria(c);
    setVisibleCount(PERFUMES_INICIAL);
  }

  function cambiarBusqueda(q: string) {
    setBusqueda(q);
    setVisibleCount(PERFUMES_INICIAL);
  }

  function cambiarOrden(o: Orden) {
    setOrden(o);
    setVisibleCount(PERFUMES_INICIAL);
  }

  const resultadoVisible = resultado.slice(0, visibleCount);
  const hayMas = resultado.length > visibleCount;

  // Refleja los filtros en la URL (sin recargar) para que "atrás" desde la
  // ficha de un producto vuelva exactamente con el mismo filtro y la misma
  // cantidad de perfumes ya cargados.
  useEffect(() => {
    const params = new URLSearchParams();
    if (categoria !== "todos") params.set("categoria", categoria);
    if (busqueda) params.set("q", busqueda);
    if (orden !== "destacados") params.set("orden", orden);
    if (visibleCount > PERFUMES_INICIAL) params.set("mostrar", String(visibleCount));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [categoria, busqueda, orden, visibleCount, pathname, router]);

  function verMas() {
    setVisibleCount((v) => Math.min(resultado.length, v + PERFUMES_INCREMENTO));
  }

  return (
    <div>
      <div className="flex flex-col gap-6 border-b border-[var(--color-border)] pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => cambiarCategoria(c)}
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
            onChange={(e) => cambiarBusqueda(e.target.value)}
            placeholder="Buscar por nombre o marca"
            className="min-w-0 rounded-full border border-[var(--color-border)] bg-transparent px-4 py-1.5 text-sm outline-none focus:border-[var(--color-gold)] sm:w-56"
          />
          <select
            value={orden}
            onChange={(e) => cambiarOrden(e.target.value as Orden)}
            className="min-w-0 appearance-none rounded-full border border-[var(--color-border)] bg-[var(--color-paper)] bg-[length:14px] bg-[right_1rem_center] bg-no-repeat pl-4 pr-9 py-1.5 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-gold)]"
            style={GOLD_CHEVRON_STYLE}
          >
            <option value="destacados" className={SELECT_OPTION_CLASSNAME}>
              Destacados
            </option>
            <option value="precio-asc" className={SELECT_OPTION_CLASSNAME}>
              Precio: menor a mayor
            </option>
            <option value="precio-desc" className={SELECT_OPTION_CLASSNAME}>
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
        <>
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 py-10 sm:grid-cols-3 lg:grid-cols-4">
            {resultadoVisible.map((perfume) => (
              <PerfumeCard key={perfume.id} perfume={perfume} />
            ))}
          </div>
          {hayMas && (
            <div className="flex justify-center pb-10">
              <button
                type="button"
                onClick={verMas}
                className="rounded-full border border-[var(--color-ink)] px-8 py-3 text-sm tracking-wide text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
              >
                Ver más
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
