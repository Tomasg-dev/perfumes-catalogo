import Link from "next/link";
import PerfumeImage from "./PerfumeImage";
import WhatsAppButton from "./WhatsAppButton";
import AddToCartButton from "./AddToCartButton";
import { formatPrice, CATEGORIA_LABELS } from "@/lib/format";
import type { Perfume } from "@/lib/types";

export default function PerfumeCard({
  perfume,
  sizes,
}: {
  perfume: Perfume;
  sizes?: string;
}) {
  return (
    <div className="group flex flex-col">
      <Link href={`/producto/${perfume.slug}`} className="block">
        <PerfumeImage
          imagenUrl={perfume.imagenUrl}
          nombre={perfume.nombre}
          marca={perfume.marca}
          sizes={sizes}
        />
      </Link>
      <div className="flex items-start justify-between gap-3 pt-4">
        <div className="min-w-0">
          <Link href={`/producto/${perfume.slug}`} className="block">
            <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
              {perfume.marca}
            </p>
            <h3 className="mt-1 truncate font-serif text-lg text-[var(--color-ink)] group-hover:text-[var(--color-gold)] transition-colors">
              {perfume.nombre}
            </h3>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              {CATEGORIA_LABELS[perfume.categoria]} · {perfume.ml} ml
            </p>
          </Link>
          <p className="mt-2 text-sm text-[var(--color-ink)]">
            {formatPrice(perfume.precio)}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <AddToCartButton perfume={perfume} variant="compact" />
          <WhatsAppButton perfume={perfume} variant="compact" />
        </div>
      </div>
    </div>
  );
}
