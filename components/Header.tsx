"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import CartButton from "./CartButton";
import BottleIcon from "./icons/BottleIcon";
import SneakerIcon from "./icons/SneakerIcon";
import { SITE_NAME } from "@/lib/config";

export default function Header() {
  const pathname = usePathname() ?? "";
  const perfumesActive = pathname === "/perfumes" || pathname.startsWith("/producto/");
  const tenisActive = pathname.startsWith("/tenis");

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)] bg-[var(--color-paper)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-serif text-2xl tracking-wide text-[var(--color-ink)]"
        >
          <BottleIcon className="h-7 w-auto text-[var(--color-gold)]" />
          {SITE_NAME}
          <SneakerIcon className="h-4 w-auto text-[var(--color-gold)]" />
        </Link>
        <nav className="flex items-center gap-4 text-sm tracking-wide text-[var(--color-ink)] sm:gap-6">
          <Link
            href="/"
            className="hidden hover:text-[var(--color-gold)] transition-colors sm:inline"
          >
            Inicio
          </Link>

          <div
            role="tablist"
            aria-label="Catálogo"
            className="flex items-center gap-1 rounded-full border border-[var(--color-border)] p-1"
          >
            <Link
              href="/perfumes"
              role="tab"
              aria-selected={perfumesActive}
              className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-widest transition-colors ${
                perfumesActive
                  ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-gold)]"
              }`}
            >
              Perfumes
            </Link>
            <Link
              href="/tenis"
              role="tab"
              aria-selected={tenisActive}
              className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-widest transition-colors ${
                tenisActive
                  ? "bg-[var(--color-ink)] text-[var(--color-paper)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-gold)]"
              }`}
            >
              Tenis
            </Link>
          </div>

          <CartButton />
        </nav>
      </div>
    </header>
  );
}
