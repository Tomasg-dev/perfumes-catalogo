import Link from "next/link";
import { getAllTenisAdmin } from "@/lib/tenis";
import { formatPrice } from "@/lib/format";
import { COLORES_TENIS } from "@/lib/colores-tenis";
import { GOLD_CHEVRON_STYLE, SELECT_OPTION_CLASSNAME } from "@/lib/select-style";
import ImageZoom from "@/components/ImageZoom";
import { updateTenis, deleteTenis } from "../actions";

export default async function AdminTenisPage() {
  const tenis = await getAllTenisAdmin();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-[var(--color-ink)]">
          Tenis ({tenis.length})
        </h1>
        <Link
          href="/admin/tenis/subir"
          className="rounded-full border border-[var(--color-ink)] px-4 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
        >
          + Subir imágenes
        </Link>
      </div>

      {tenis.length === 0 ? (
        <p className="mt-8 text-sm text-[var(--color-muted)]">
          Todavía no hay tenis cargados.
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {tenis.map((t) => (
            <form
              key={t.id}
              action={updateTenis.bind(null, t.id)}
              className="flex flex-col gap-3 border-b border-[var(--color-border)] pb-4 sm:flex-row sm:items-center"
            >
              {t.imagenUrl ? (
                <ImageZoom src={t.imagenUrl} alt={t.nombre} className="h-20 w-20 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={t.imagenUrl}
                    alt={t.nombre}
                    className="h-20 w-20 shrink-0 rounded object-cover"
                  />
                </ImageZoom>
              ) : (
                <div className="h-20 w-20 shrink-0 rounded bg-[var(--color-paper-alt)]" />
              )}
              <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-5">
                <input
                  type="text"
                  name="nombre"
                  defaultValue={t.nombre}
                  className="rounded border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
                />
                <select
                  name="categoria"
                  defaultValue={t.categoria}
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
                  name="color"
                  defaultValue={t.color ?? ""}
                  className="appearance-none rounded border border-[var(--color-border)] bg-[var(--color-paper)] bg-[length:14px] bg-[right_0.75rem_center] bg-no-repeat py-2 pl-3 pr-8 text-sm text-[var(--color-ink)] outline-none focus:border-[var(--color-gold)]"
                  style={GOLD_CHEVRON_STYLE}
                >
                  <option value="" className={SELECT_OPTION_CLASSNAME}>
                    Sin color
                  </option>
                  {COLORES_TENIS.map((c) => (
                    <option key={c} value={c} className={SELECT_OPTION_CLASSNAME}>
                      {c[0].toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  name="precio"
                  min={0}
                  defaultValue={t.precio ?? ""}
                  placeholder={formatPrice(null)}
                  className="rounded border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
                />
                <div className="flex flex-col justify-center gap-1 text-sm text-[var(--color-ink)]">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="activo" defaultChecked={t.activo} />
                    Visible
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="destacado" defaultChecked={t.destacado} />
                    Destacado
                  </label>
                </div>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="submit"
                  className="rounded-full border border-[var(--color-gold)] px-4 py-2 text-sm text-[var(--color-ink)] hover:bg-[var(--color-gold)] hover:text-[var(--color-paper)]"
                >
                  Guardar
                </button>
                <button
                  formAction={deleteTenis.bind(null, t.id, t.imagenUrl ?? "")}
                  className="rounded-full border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-muted)] hover:border-red-600 hover:text-red-600"
                >
                  Borrar
                </button>
              </div>
            </form>
          ))}
        </div>
      )}
    </div>
  );
}
