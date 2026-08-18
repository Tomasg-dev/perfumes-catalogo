import WhatsAppButton from "./WhatsAppButton";
import { SITE_NAME } from "@/lib/config";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--color-border)] bg-[var(--color-paper-alt)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-16 text-center">
        <h2 className="font-serif text-2xl text-[var(--color-ink)]">
          ¿Tienes preguntas sobre algún perfume?
        </h2>
        <p className="max-w-md text-sm text-[var(--color-muted)]">
          Escríbenos por WhatsApp y te ayudamos a elegir la fragancia perfecta.
        </p>
        <WhatsAppButton />
        <p className="mt-8 text-xs text-[var(--color-muted)]">
          © {new Date().getFullYear()} {SITE_NAME}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
