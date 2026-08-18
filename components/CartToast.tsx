"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";

const EXIT_DURATION_MS = 300;

export default function CartToast() {
  const { toast } = useCart();
  const [rendered, setRendered] = useState<{ id: number; message: string } | null>(null);
  const [visible, setVisible] = useState(false);

  // Ajuste de estado durante el render (patrón recomendado en vez de un
  // efecto) para memorizar el último toast y poder seguir mostrando su
  // mensaje mientras se anima la salida del anterior.
  if (toast && toast.id !== rendered?.id) {
    setRendered(toast);
  }

  // La entrada se dispara un frame después del mount para que el navegador
  // anime la transición en vez de saltar directo al estado final. La
  // salida se desmonta con un temporizador que iguala la duración de la
  // transición CSS, en vez de depender del evento nativo "transitionend"
  // (poco fiable si la pestaña queda en segundo plano).
  useEffect(() => {
    if (toast) {
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    const hideFrame = requestAnimationFrame(() => setVisible(false));
    const unmountTimer = setTimeout(() => setRendered(null), EXIT_DURATION_MS);
    return () => {
      cancelAnimationFrame(hideFrame);
      clearTimeout(unmountTimer);
    };
  }, [toast]);

  if (!rendered) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-6"
    >
      <div
        className={`flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-5 py-3 text-sm text-[var(--color-paper)] shadow-lg transition-all duration-300 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        <CheckIcon />
        {rendered.message}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0 text-[var(--color-gold)]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}
