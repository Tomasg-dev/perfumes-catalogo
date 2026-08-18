"use client";

import { useCart } from "@/lib/cart-context";

export default function CartButton() {
  const { itemCount, isHydrated, openCart } = useCart();
  const showBadge = isHydrated && itemCount > 0;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Ver carrito${showBadge ? ` (${itemCount} productos)` : ""}`}
      className="relative flex h-9 w-9 items-center justify-center text-[var(--color-ink)] transition-colors hover:text-[var(--color-gold)]"
    >
      <CartIcon />
      {showBadge && (
        <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-gold)] px-1 text-[10px] font-medium text-[var(--color-paper)]">
          {itemCount}
        </span>
      )}
    </button>
  );
}

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="9" cy="20" r="1" />
      <circle cx="17" cy="20" r="1" />
      <path d="M2.5 3h2l2.2 11.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L20 7H6" />
    </svg>
  );
}
