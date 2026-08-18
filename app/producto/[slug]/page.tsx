import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PerfumeImage from "@/components/PerfumeImage";
import WhatsAppButton from "@/components/WhatsAppButton";
import AddToCartButton from "@/components/AddToCartButton";
import RelatedPerfumes from "@/components/RelatedPerfumes";
import { getPerfumes, getPerfumeBySlug } from "@/lib/sheets";
import { getRelatedPerfumes } from "@/lib/related";
import { formatPrice, CATEGORIA_LABELS } from "@/lib/format";

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

  return {
    title: `${perfume.marca} ${perfume.nombre} | Essence`,
    description: perfume.descripcion,
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

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <Link
          href="/catalogo"
          className="text-sm text-[var(--color-muted)] hover:text-[var(--color-gold)]"
        >
          ← Volver al catálogo
        </Link>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="mx-auto w-full max-w-md">
            <PerfumeImage
              imagenUrl={perfume.imagenUrl}
              nombre={perfume.nombre}
              marca={perfume.marca}
              priority
              sizes="(max-width: 1024px) 100vw, 448px"
            />
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
              <WhatsAppButton perfume={perfume} />
              <AddToCartButton perfume={perfume} />
            </div>
          </div>
        </div>
      </div>

      <RelatedPerfumes perfumes={relacionados} />
    </>
  );
}
