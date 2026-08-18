"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { getCartWhatsAppLink } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/format";
import PerfumeImage from "./PerfumeImage";

export default function CartDrawer() {
  const { items, isOpen, total, pendingPriceCount, removeItem, clear, closeCart } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-label="Carrito de pedido"
        className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-[var(--color-paper)] shadow-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5">
          <h2 className="font-serif text-xl text-[var(--color-ink)]">
            Tu pedido {items.length > 0 && `(${items.length})`}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="text-[var(--color-muted)] hover:text-[var(--color-gold)]"
          >
            <CloseIcon />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-sm text-[var(--color-muted)]">
              Aún no has agregado perfumes a tu pedido.
            </p>
            <Link
              href="/catalogo"
              onClick={closeCart}
              className="text-sm text-[var(--color-gold)] hover:underline"
            >
              Explorar catálogo
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6 py-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center gap-4 border-b border-[var(--color-border)] py-4 first:pt-0"
                >
                  <div className="w-16 shrink-0">
                    <PerfumeImage
                      imagenUrl={item.imagenUrl}
                      nombre={item.nombre}
                      marca={item.marca}
                      sizes="64px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs uppercase tracking-widest text-[var(--color-muted)]">
                      {item.marca}
                    </p>
                    <p className="truncate font-serif text-base text-[var(--color-ink)]">
                      {item.nombre}
                    </p>
                    <p className="mt-1 text-sm text-[var(--color-ink)]">
                      {formatPrice(item.precio)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Quitar ${item.nombre} del carrito`}
                    className="shrink-0 text-[var(--color-muted)] hover:text-[var(--color-gold)]"
                  >
                    <CloseIcon small />
                  </button>
                </li>
              ))}
            </ul>

            <div className="border-t border-[var(--color-border)] px-6 py-5">
              <div className="mb-4">
                {pendingPriceCount === items.length ? (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-muted)]">Total</span>
                    <span className="text-sm text-[var(--color-ink)]">
                      Precios por confirmar
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--color-muted)]">Total</span>
                      <span className="text-lg text-[var(--color-ink)]">
                        {formatPrice(total)}
                      </span>
                    </div>
                    {pendingPriceCount > 0 && (
                      <p className="mt-1 text-xs text-[var(--color-muted)]">
                        + {pendingPriceCount}{" "}
                        {pendingPriceCount === 1 ? "producto" : "productos"} con
                        precio por confirmar por WhatsApp
                      </p>
                    )}
                  </>
                )}
              </div>
              <a
                href={getCartWhatsAppLink(items)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-sm tracking-wide text-[var(--color-paper)] transition-colors hover:bg-[var(--color-gold)]"
              >
                Enviar pedido por WhatsApp
              </a>
              <button
                type="button"
                onClick={clear}
                className="mt-3 w-full text-center text-xs text-[var(--color-muted)] hover:text-[var(--color-gold)]"
              >
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function CloseIcon({ small = false }: { small?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={small ? "h-4 w-4" : "h-5 w-5"}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
