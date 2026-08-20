import Link from "next/link";
import BottleIcon from "./icons/BottleIcon";
import SneakerIcon from "./icons/SneakerIcon";

interface TileProps {
  href: string;
  titulo: string;
  descripcion: string;
  icon: React.ReactNode;
}

function CategoryTile({ href, titulo, descripcion, icon }: TileProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-paper-alt)] px-8 py-14 text-center transition-colors hover:border-[var(--color-gold)]"
    >
      <span className="text-[var(--color-gold)] transition-transform duration-300 group-hover:scale-105">
        {icon}
      </span>
      <span className="font-serif text-2xl text-[var(--color-ink)]">{titulo}</span>
      <span className="text-sm text-[var(--color-muted)]">{descripcion}</span>
      <span className="mt-2 text-xs uppercase tracking-widest text-[var(--color-gold)]">
        Ver catálogo →
      </span>
    </Link>
  );
}

export default function CategoryTiles({
  perfumesCount,
  tenisCount,
}: {
  perfumesCount: number;
  tenisCount: number;
}) {
  return (
    <section id="catalogos" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <CategoryTile
          href="/perfumes"
          titulo="Perfumes"
          descripcion={`${perfumesCount} fragancias disponibles`}
          icon={<BottleIcon className="h-16 w-auto" />}
        />
        <CategoryTile
          href="/tenis"
          titulo="Tenis"
          descripcion={
            tenisCount > 0
              ? `${tenisCount} ${tenisCount === 1 ? "par disponible" : "pares disponibles"}`
              : "Descubre nuestra colección"
          }
          icon={<SneakerIcon className="h-16 w-auto" />}
        />
      </div>
    </section>
  );
}
