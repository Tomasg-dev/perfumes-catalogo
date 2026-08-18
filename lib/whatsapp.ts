import { WHATSAPP_NUMBER } from "./config";
import type { CartItem, Perfume } from "./types";
import { formatPrice } from "./format";

export function getWhatsAppLink(perfume?: Pick<Perfume, "nombre" | "marca">): string {
  const message = perfume
    ? `Hola, quiero información sobre ${perfume.marca} - ${perfume.nombre}`
    : "Hola, quiero información sobre sus perfumes";

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function getCartWhatsAppLink(items: CartItem[]): string {
  const lineas = items.map(
    (item, i) => `${i + 1}. ${item.marca} - ${item.nombre} (${formatPrice(item.precio)})`
  );
  const total = items.reduce((sum, item) => sum + (item.precio ?? 0), 0);
  const pendientes = items.filter((item) => item.precio === null).length;

  let totalLinea: string;
  if (pendientes === items.length) {
    totalLinea = "Total: precios por confirmar por este medio";
  } else if (pendientes > 0) {
    totalLinea = `Total (precios confirmados): ${formatPrice(total)} — ${pendientes} producto(s) con precio por confirmar`;
  } else {
    totalLinea = `Total: ${formatPrice(total)}`;
  }

  const message = [
    "Hola, quiero pedir estos perfumes:",
    "",
    ...lineas,
    "",
    totalLinea,
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
