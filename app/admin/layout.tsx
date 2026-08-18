import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return children;

  return (
    <div>
      <header className="border-b border-[var(--color-border)] bg-[var(--color-paper-alt)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <nav className="flex items-center gap-6 text-sm tracking-wide text-[var(--color-ink)]">
            <Link href="/admin/tenis" className="hover:text-[var(--color-gold)]">
              Tenis
            </Link>
            <Link href="/admin/tenis/subir" className="hover:text-[var(--color-gold)]">
              Subir imágenes
            </Link>
          </nav>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm text-[var(--color-muted)] hover:text-[var(--color-gold)]"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-6 py-10">{children}</div>
    </div>
  );
}
