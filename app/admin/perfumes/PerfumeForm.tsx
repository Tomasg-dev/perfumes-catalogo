import { GOLD_CHEVRON_STYLE, SELECT_OPTION_CLASSNAME } from "@/lib/select-style";
import { formatPrice } from "@/lib/format";
import type { PerfumeAdmin } from "@/lib/types";

export default function PerfumeForm({
  action,
  perfume,
  submitLabel,
}: {
  action: (formData: FormData) => void | Promise<void>;
  perfume?: PerfumeAdmin | null;
  submitLabel: string;
}) {
  return (
    <form action={action} className="mt-8 flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-[var(--color-ink)]">
          Nombre
          <input
            type="text"
            name="nombre"
            defaultValue={perfume?.nombre}
            required
            className="rounded border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[var(--color-ink)]">
          Marca
          <input
            type="text"
            name="marca"
            defaultValue={perfume?.marca}
            required
            className="rounded border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <label className="flex flex-col gap-1 text-sm text-[var(--color-ink)]">
          Categoría
          <select
            name="categoria"
            defaultValue={perfume?.categoria ?? "hombre"}
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
        </label>
        <label className="flex flex-col gap-1 text-sm text-[var(--color-ink)]">
          Precio
          <input
            type="number"
            name="precio"
            min={0}
            defaultValue={perfume?.precio ?? ""}
            placeholder={formatPrice(null)}
            className="rounded border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[var(--color-ink)]">
          ml
          <input
            type="number"
            name="ml"
            min={0}
            defaultValue={perfume?.ml ?? 100}
            className="rounded border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
          />
        </label>
        <div className="flex flex-col justify-end gap-1 pb-2 text-sm text-[var(--color-ink)]">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="activo" defaultChecked={perfume?.activo ?? true} />
            Visible
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="destacado" defaultChecked={perfume?.destacado ?? false} />
            Destacado
          </label>
        </div>
      </div>

      <label className="flex flex-col gap-1 text-sm text-[var(--color-ink)]">
        Imagen (ruta en public/perfumes, p.ej. /perfumes/archivo.webp)
        <input
          type="text"
          name="imagenUrl"
          defaultValue={perfume?.imagenUrl ?? ""}
          placeholder="/perfumes/archivo.webp"
          className="rounded border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-[var(--color-ink)]">
        Descripción
        <textarea
          name="descripcion"
          defaultValue={perfume?.descripcion}
          rows={3}
          className="rounded border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
        />
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm text-[var(--color-ink)]">
          Notas de salida (separadas por coma)
          <input
            type="text"
            name="notasSalida"
            defaultValue={perfume?.notasSalida.join(", ")}
            className="rounded border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[var(--color-ink)]">
          Notas de corazón
          <input
            type="text"
            name="notasCorazon"
            defaultValue={perfume?.notasCorazon.join(", ")}
            className="rounded border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-[var(--color-ink)]">
          Notas de fondo
          <input
            type="text"
            name="notasFondo"
            defaultValue={perfume?.notasFondo.join(", ")}
            className="rounded border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
          />
        </label>
      </div>

      <button
        type="submit"
        className="w-fit rounded-full border border-[var(--color-gold)] bg-[var(--color-gold)] px-6 py-2.5 text-sm tracking-wide text-[var(--color-paper)] transition-colors hover:opacity-90"
      >
        {submitLabel}
      </button>
    </form>
  );
}
