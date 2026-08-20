import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PerfumeImage from "@/components/PerfumeImage";
import ImageZoom from "@/components/ImageZoom";
import BackLink from "@/components/BackLink";
import WhatsAppButton from "@/components/WhatsAppButton";
import AddToCartButton from "@/components/AddToCartButton";
import RelatedPerfumes from "@/components/RelatedPerfumes";
import { getPerfumes, getPerfumeBySlug } from "@/lib/perfumes";
import { getRelatedPerfumes } from "@/lib/related";
import { formatPrice, CATEGORIA_LABELS } from "@/lib/format";
import { perfumeToCartItem } from "@/lib/cart-items";
import { buildProductJsonLd, absoluteUrl } from "@/lib/seo";
import { SITE_URL, SITE_NAME } from "@/lib/config";

export async function generateStaticParams() {
  const perfumes = await getPerfumes();
  return perfumes.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/producto/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const perfume = await getPerfumeBySlug(slug);

  if (!perfume) return { title: "Perfume no encontrado" };

  const title = `${perfume.marca} ${perfume.nombre} | ${SITE_NAME}`;
  const image = absoluteUrl(perfume.imagenUrl);

  return {
    title,
    description: perfume.descripcion,
    alternates: { canonical: `/producto/${perfume.slug}` },
    openGraph: {
      title,
      description: perfume.descripcion,
      siteName: SITE_NAME,
      locale: "es_CO",
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description: perfume.descripcion,
      images: image ? [image] : undefined,
    },
  };
}

function NoteList({ titulo, notas }: { titulo: string; notas: string[] }) {
  if (notas.length === 0) return null;
  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-[var(--color-gold)]">
        {titulo}
      </p>
      <p className="mt-1 text-sm text-[var(--color-ink)]">{notas.join(", ")}</p>
    </div>
  );
}

export default async function ProductoPage({
  params,
}: PageProps<"/producto/[slug]">) {
  const { slug } = await params;
  const perfumes = await getPerfumes();
  const perfume = perfumes.find((p) => p.slug === slug) ?? null;

  if (!perfume) notFound();

  const relacionados = getRelatedPerfumes(perfume, perfumes);

  const jsonLd = buildProductJsonLd({
    name: `${perfume.marca} ${perfume.nombre}`,
    brand: perfume.marca,
    description: perfume.descripcion,
    image: perfume.imagenUrl,
    price: perfume.precio,
    url: `${SITE_URL}/producto/${perfume.slug}`,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto max-w-6xl px-6 py-16">
        <BackLink
          fallbackHref="/perfumes"
          className="text-sm text-[var(--color-muted)] hover:text-[var(--color-gold)]"
        >
          ← Volver al catálogo
        </BackLink>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="mx-auto w-full max-w-md">
            {perfume.imagenUrl ? (
              <ImageZoom src={perfume.imagenUrl} alt={`${perfume.marca} ${perfume.nombre}`}>
                <PerfumeImage
                  imagenUrl={perfume.imagenUrl}
                  nombre={perfume.nombre}
                  marca={perfume.marca}
                  priority
                  sizes="(max-width: 1024px) 100vw, 448px"
                />
              </ImageZoom>
            ) : (
              <PerfumeImage
                imagenUrl={perfume.imagenUrl}
                nombre={perfume.nombre}
                marca={perfume.marca}
                priority
                sizes="(max-width: 1024px) 100vw, 448px"
              />
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-widest text-[var(--color-muted)]">
              {perfume.marca}
            </p>
            <h1 className="mt-2 font-serif text-4xl text-[var(--color-ink)]">
              {perfume.nombre}
            </h1>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              {CATEGORIA_LABELS[perfume.categoria]} · {perfume.ml} ml
            </p>
            <p className="mt-6 text-2xl text-[var(--color-ink)]">
              {formatPrice(perfume.precio)}
            </p>

            {perfume.descripcion && (
              <p className="mt-6 max-w-md text-sm leading-relaxed text-[var(--color-ink)]">
                {perfume.descripcion}
              </p>
            )}

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <NoteList titulo="Notas de salida" notas={perfume.notasSalida} />
              <NoteList titulo="Notas de corazón" notas={perfume.notasCorazon} />
              <NoteList titulo="Notas de fondo" notas={perfume.notasFondo} />
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <WhatsAppButton producto={perfume} />
              <AddToCartButton item={perfumeToCartItem(perfume)} />
            </div>
          </div>
        </div>
      </div>

      <RelatedPerfumes perfumes={relacionados} />
    </>
  );
}
