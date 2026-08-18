import { WHATSAPP_NUMBER } from "./config";
import type { CartItem } from "./types";
import { formatPrice } from "./format";

export function getWhatsAppLink(producto?: { nombre: string; marca?: string }): string {
  const message = producto
    ? `Hola, quiero información sobre ${
        producto.marca ? `${producto.marca} - ${producto.nombre}` : producto.nombre
      }`
    : "Hola, quiero información sobre sus productos";

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function lineaItem(item: CartItem, i: number): string {
  const etiqueta = item.marca ? `${item.marca} - ${item.nombre}` : item.nombre;
  return `${i + 1}. ${etiqueta} (${formatPrice(item.precio)})`;
}

export function getCartWhatsAppLink(items: CartItem[]): string {
  const perfumes = items.filter((i) => i.tipo === "perfume");
  const tenis = items.filter((i) => i.tipo === "tenis");

  const secciones: string[] = [];
  if (perfumes.length > 0) {
    secciones.push("Perfumes:", ...perfumes.map(lineaItem), "");
  }
  if (tenis.length > 0) {
    secciones.push("Tenis:", ...tenis.map(lineaItem), "");
  }

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

  const message = ["Hola, quiero pedir estos productos:", "", ...secciones, totalLinea].join(
    "\n"
  );

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
