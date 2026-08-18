import Link from "next/link";
import CartButton from "./CartButton";
import { SITE_NAME } from "@/lib/config";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-paper)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-serif text-2xl tracking-wide text-[var(--color-ink)]">
          {SITE_NAME}
        </Link>
        <nav className="flex items-center gap-8 text-sm tracking-wide text-[var(--color-ink)]">
          <Link href="/" className="hover:text-[var(--color-gold)] transition-colors">
            Inicio
          </Link>
          <Link
            href="/catalogo"
            className="hover:text-[var(--color-gold)] transition-colors"
          >
            Catálogo
          </Link>
          <CartButton />
        </nav>
      </div>
    </header>
  );
}
