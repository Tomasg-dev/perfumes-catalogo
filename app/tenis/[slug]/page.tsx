import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PerfumeImage from "@/components/PerfumeImage";
import WhatsAppButton from "@/components/WhatsAppButton";
import AddToCartButton from "@/components/AddToCartButton";
import { getTenisBySlug } from "@/lib/tenis";
import { formatPrice, CATEGORIA_LABELS } from "@/lib/format";
import { tenisToCartItem } from "@/lib/cart-items";

export async function generateMetadata({
  params,
}: PageProps<"/tenis/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const tenis = await getTenisBySlug(slug);

  if (!tenis) return { title: "Tenis no encontrado" };

  return {
    title: `${tenis.nombre} | Essence`,
    description: `${tenis.nombre} — ${CATEGORIA_LABELS[tenis.categoria]}.`,
  };
}

export default async function TenisDetailPage({
  params,
}: PageProps<"/tenis/[slug]">) {
  const { slug } = await params;
  const tenis = await getTenisBySlug(slug);

  if (!tenis) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Link
        href="/tenis"
        className="text-sm text-[var(--color-muted)] hover:text-[var(--color-gold)]"
      >
        ← Volver al catálogo de tenis
      </Link>

      <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="mx-auto w-full max-w-md">
          <PerfumeImage
            imagenUrl={tenis.imagenUrl}
            nombre={tenis.nombre}
            priority
            unoptimized
            sizes="(max-width: 1024px) 100vw, 448px"
          />
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="font-serif text-4xl text-[var(--color-ink)]">{tenis.nombre}</h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            {CATEGORIA_LABELS[tenis.categoria]}
            {tenis.color ? ` · ${tenis.color[0].toUpperCase() + tenis.color.slice(1)}` : ""}
          </p>
          <p className="mt-6 text-2xl text-[var(--color-ink)]">{formatPrice(tenis.precio)}</p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <WhatsAppButton producto={tenis} />
            <AddToCartButton item={tenisToCartItem(tenis)} />
          </div>
        </div>
      </div>
    </div>
  );
}
