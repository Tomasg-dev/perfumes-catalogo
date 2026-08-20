import Link from "next/link";
import PerfumeImage from "./PerfumeImage";
import WhatsAppButton from "./WhatsAppButton";
import AddToCartButton from "./AddToCartButton";
import { formatPrice, CATEGORIA_LABELS } from "@/lib/format";
import type { Perfume } from "@/lib/types";
import { perfumeToCartItem } from "@/lib/cart-items";

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
      <div className="pt-4">
        <Link href={`/producto/${perfume.slug}`} className="block">
          <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
            {perfume.marca}
          </p>
          <h3 className="mt-1 line-clamp-2 font-serif text-lg leading-snug text-[var(--color-ink)] group-hover:text-[var(--color-gold)] transition-colors">
            {perfume.nombre}
          </h3>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            {CATEGORIA_LABELS[perfume.categoria]} · {perfume.ml} ml
          </p>
        </Link>
        <div className="mt-2 flex items-center justify-between gap-3">
          <p className="text-sm text-[var(--color-ink)]">{formatPrice(perfume.precio)}</p>
          <div className="flex shrink-0 gap-2">
            <AddToCartButton item={perfumeToCartItem(perfume)} variant="compact" />
            <WhatsAppButton producto={perfume} variant="compact" />
          </div>
        </div>
      </div>
    </div>
  );
}
