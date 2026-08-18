import { getWhatsAppLink } from "@/lib/whatsapp";
import type { Perfume } from "@/lib/types";

interface WhatsAppButtonProps {
  perfume?: Pick<Perfume, "nombre" | "marca">;
  variant?: "primary" | "compact";
  className?: string;
}

export default function WhatsAppButton({
  perfume,
  variant = "primary",
  className = "",
}: WhatsAppButtonProps) {
  const href = getWhatsAppLink(perfume);

  const base =
    "inline-flex items-center justify-center gap-2 transition-colors duration-200";
  const styles =
    variant === "primary"
      ? "rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm tracking-wide text-[var(--color-paper)] hover:bg-[var(--color-gold)]"
      : "rounded-full border border-[var(--color-border)] p-2.5 text-[var(--color-ink)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Consultar por WhatsApp"
      className={`${base} ${styles} ${className}`}
    >
      <WhatsAppIcon />
      {variant === "primary" && <span>Consultar por WhatsApp</span>}
    </a>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.51 2 12.04 2Zm5.8 14.09c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.12.11-1.8-.12-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.13-4.9-4.32-.14-.19-1.17-1.56-1.17-2.98s.73-2.11 1-2.4c.24-.27.53-.34.71-.34.18 0 .35 0 .5.01.16.01.38-.06.6.45.24.56.8 1.95.87 2.09.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.16-.29.36-.42.48-.14.14-.28.29-.12.56.16.28.71 1.17 1.53 1.89 1.05.94 1.94 1.23 2.21 1.37.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.18-.27.36-.22.6-.13.24.09 1.53.72 1.79.85.26.13.44.19.5.3.07.11.07.62-.17 1.3Z" />
    </svg>
  );
}
