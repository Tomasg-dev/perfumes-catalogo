"use client";

import { useCart } from "@/lib/cart-context";
import type { CartItem } from "@/lib/types";

interface AddToCartButtonProps {
  perfume: CartItem;
  variant?: "primary" | "compact";
  className?: string;
}

export default function AddToCartButton({
  perfume,
  variant = "primary",
  className = "",
}: AddToCartButtonProps) {
  const { isInCart, toggleItem } = useCart();
  const enCarrito = isInCart(perfume.id);

  // Se guarda solo el subconjunto mínimo en el carrito (no el objeto
  // Perfume completo que llega desde la tarjeta/página), para mantener
  // liviano lo que se persiste en localStorage.
  const handleToggle = () =>
    toggleItem({
      id: perfume.id,
      slug: perfume.slug,
      nombre: perfume.nombre,
      marca: perfume.marca,
      precio: perfume.precio,
      imagenUrl: perfume.imagenUrl,
    });

  const base = "inline-flex items-center justify-center gap-2 transition-colors duration-200";

  if (variant === "compact") {
    const styles = enCarrito
      ? "rounded-full border border-[var(--color-gold)] bg-[var(--color-gold)] p-2.5 text-[var(--color-paper)]"
      : "rounded-full border border-[var(--color-border)] p-2.5 text-[var(--color-ink)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]";

    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-label={enCarrito ? "Quitar del carrito" : "Agregar al carrito"}
        aria-pressed={enCarrito}
        className={`${base} ${styles} ${className}`}
      >
        {enCarrito ? <CheckIcon /> : <PlusIcon />}
      </button>
    );
  }

  const styles = enCarrito
    ? "rounded-full border border-[var(--color-gold)] bg-[var(--color-gold)] px-6 py-3 text-sm tracking-wide text-[var(--color-paper)]"
    : "rounded-full border border-[var(--color-ink)] px-6 py-3 text-sm tracking-wide text-[var(--color-ink)] hover:bg-[var(--color-ink)] hover:text-[var(--color-paper)]";

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={enCarrito}
      className={`${base} ${styles} ${className}`}
    >
      {enCarrito ? <CheckIcon /> : <PlusIcon />}
      <span>{enCarrito ? "Agregado al carrito" : "Agregar al carrito"}</span>
    </button>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}
