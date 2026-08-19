import type { Metadata } from "next";
import Link from "next/link";
import PerfumeCard from "@/components/PerfumeCard";
import TenisCard from "@/components/TenisCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import TrustStrip from "@/components/TrustStrip";
import CategoryTiles from "@/components/CategoryTiles";
import HeroWatermark from "@/components/HeroWatermark";
import { getPerfumes } from "@/lib/sheets";
import { getTenisPage } from "@/lib/tenis";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Home() {
  const [perfumes, tenisPage] = await Promise.all([
    getPerfumes(),
    getTenisPage({ page: 1 }),
  ]);

  const perfumesDestacados = perfumes.filter((p) => p.destacado).slice(0, 4);
  const mostrarPerfumes =
    perfumesDestacados.length > 0 ? perfumesDestacados : perfumes.slice(0, 4);
  const mostrarTenis = tenisPage.items.slice(0, 4);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-paper-alt)]">
        <HeroWatermark />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-28 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">
            Perfumes y tenis con estilo
          </p>
          <h1 className="max-w-2xl font-serif text-4xl leading-tight text-[var(--color-ink)] sm:text-5xl">
            Perfumes y tenis que hablan por ti
          </h1>
          <p className="max-w-md text-sm text-[var(--color-muted)] sm:text-base">
            Explora nuestros catálogos, consulta disponibilidad y envíos
            directamente por WhatsApp.
          </p>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row">
            <a
              href="#catalogos"
              className="rounded-full border border-[var(--color-ink)] px-6 py-3 text-sm tracking-wide text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
            >
              Explorar catálogos
            </a>
            <WhatsAppButton />
          </div>

          <a
            href="#catalogos"
            aria-label="Ver catálogos"
            className="animate-gentle-bounce mt-16 flex flex-col items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-muted)] transition-colors hover:text-[var(--color-gold)]"
          >
            <span>Descubre más</span>
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M5 9l7 7 7-7" />
            </svg>
          </a>
        </div>
      </section>

      <CategoryTiles perfumesCount={perfumes.length} tenisCount={tenisPage.total} />

      <TrustStrip />

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-serif text-2xl text-[var(--color-ink)]">
                Perfumes destacados
              </h2>
              <Link
                href="/perfumes"
                className="text-sm text-[var(--color-muted)] hover:text-[var(--color-gold)]"
              >
                Ver todo →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-8">
              {mostrarPerfumes.map((perfume) => (
                <PerfumeCard
                  key={perfume.id}
                  perfume={perfume}
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-serif text-2xl text-[var(--color-ink)]">
                Tenis destacados
              </h2>
              <Link
                href="/tenis"
                className="text-sm text-[var(--color-muted)] hover:text-[var(--color-gold)]"
              >
                Ver todo →
              </Link>
            </div>
            {mostrarTenis.length > 0 ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                {mostrarTenis.map((tenis) => (
                  <TenisCard
                    key={tenis.id}
                    tenis={tenis}
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                ))}
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--color-border)] px-6 py-16 text-center">
                <p className="text-sm text-[var(--color-muted)]">
                  Muy pronto vas a encontrar aquí nuestra colección de tenis.
                </p>
                <Link
                  href="/tenis"
                  className="text-xs uppercase tracking-widest text-[var(--color-gold)] hover:underline"
                >
                  Ver catálogo →
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
