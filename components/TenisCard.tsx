import Link from "next/link";
import PerfumeImage from "./PerfumeImage";
import AddToCartButton from "./AddToCartButton";
import WhatsAppButton from "./WhatsAppButton";
import type { Tenis } from "@/lib/types";
import { CATEGORIA_LABELS, formatPrice } from "@/lib/format";
import { tenisToCartItem } from "@/lib/cart-items";

export default function TenisCard({
  tenis,
  sizes,
}: {
  tenis: Tenis;
  sizes?: string;
}) {
  return (
    <div className="group flex flex-col">
      <Link href={`/tenis/${tenis.slug}`} className="block">
        <PerfumeImage
          imagenUrl={tenis.imagenUrl}
          nombre={tenis.nombre}
          sizes={sizes}
        />
      </Link>
      <div className="flex items-start justify-between gap-3 pt-4">
        <div className="min-w-0">
          <Link href={`/tenis/${tenis.slug}`} className="block">
            <h3 className="truncate font-serif text-lg text-[var(--color-ink)] group-hover:text-[var(--color-gold)] transition-colors">
              {tenis.nombre}
            </h3>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              {CATEGORIA_LABELS[tenis.categoria]}
              {tenis.color ? ` · ${tenis.color[0].toUpperCase() + tenis.color.slice(1)}` : ""}
            </p>
          </Link>
          <p className="mt-2 text-sm text-[var(--color-ink)]">{formatPrice(tenis.precio)}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <AddToCartButton item={tenisToCartItem(tenis)} variant="compact" />
          <WhatsAppButton producto={tenis} variant="compact" />
        </div>
      </div>
    </div>
  );
}
