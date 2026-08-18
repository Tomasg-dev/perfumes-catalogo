import PerfumeCard from "./PerfumeCard";
import type { Perfume } from "@/lib/types";

export default function RelatedPerfumes({ perfumes }: { perfumes: Perfume[] }) {
  if (perfumes.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="mb-10 font-serif text-2xl text-[var(--color-ink)]">
        También te podría gustar
      </h2>
      <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4">
        {perfumes.map((perfume) => (
          <PerfumeCard
            key={perfume.id}
            perfume={perfume}
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        ))}
      </div>
    </section>
  );
}
