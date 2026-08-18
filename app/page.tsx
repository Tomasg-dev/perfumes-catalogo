import Link from "next/link";
import PerfumeCard from "@/components/PerfumeCard";
import WhatsAppButton from "@/components/WhatsAppButton";
import TrustStrip from "@/components/TrustStrip";
import HeroBottleWatermark from "@/components/HeroBottleWatermark";
import { getPerfumes } from "@/lib/sheets";

export default async function Home() {
  const perfumes = await getPerfumes();
  const destacados = perfumes.filter((p) => p.destacado).slice(0, 4);
  const mostrar = destacados.length > 0 ? destacados : perfumes.slice(0, 4);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-paper-alt)]">
        <HeroBottleWatermark />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-28 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-gold)]">
            Fragancias seleccionadas
          </p>
          <h1 className="max-w-2xl font-serif text-4xl leading-tight text-[var(--color-ink)] sm:text-5xl">
            Encuentra tu próxima fragancia favorita
          </h1>
          <p className="max-w-md text-sm text-[var(--color-muted)] sm:text-base">
            Explora nuestro catálogo y consulta disponibilidad y envíos directamente
            por WhatsApp.
          </p>
          <div className="mt-2 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/catalogo"
              className="rounded-full border border-[var(--color-ink)] px-6 py-3 text-sm tracking-wide text-[var(--color-ink)] transition-colors hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]"
            >
              Ver catálogo
            </Link>
            <WhatsAppButton />
          </div>

          <a
            href="#destacados"
            aria-label="Ver perfumes destacados"
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

      <TrustStrip />

      <section id="destacados" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-serif text-2xl text-[var(--color-ink)]">Destacados</h2>
          <Link
            href="/catalogo"
            className="text-sm text-[var(--color-muted)] hover:text-[var(--color-gold)]"
          >
            Ver todo →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4">
          {mostrar.map((perfume) => (
            <PerfumeCard
              key={perfume.id}
              perfume={perfume}
              sizes="(max-width: 640px) 50vw, 25vw"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
