import Link from "next/link";

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
          icon={<BottleIcon />}
        />
        <CategoryTile
          href="/tenis"
          titulo="Tenis"
          descripcion={
            tenisCount > 0
              ? `${tenisCount} ${tenisCount === 1 ? "par disponible" : "pares disponibles"}`
              : "Descubre nuestra colección"
          }
          icon={<SneakerIcon />}
        />
      </div>
    </section>
  );
}

function BottleIcon() {
  return (
    <svg
      viewBox="0 0 120 160"
      className="h-16 w-auto"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="48" y="10" width="24" height="16" rx="2" />
      <rect x="52" y="6" width="16" height="6" rx="1" />
      <path d="M42 26 h36 l6 14 v96 a6 6 0 0 1 -6 6 h-36 a6 6 0 0 1 -6 -6 v-96 z" />
      <line x1="36" y1="70" x2="84" y2="70" />
    </svg>
  );
}

function SneakerIcon() {
  return (
    <svg
      viewBox="0 0 100 50"
      className="h-16 w-auto"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 38 Q10 38 10 34 Q12 24 30 20 L68 12 Q78 10 84 16 L84 38 Z" />
      <rect x="6" y="38" width="84" height="7" rx="3.5" />
      <path d="M38 18 L42 24M48 16 L52 22M58 14 L62 20" />
    </svg>
  );
}
