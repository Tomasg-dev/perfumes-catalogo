import type { CartItem, Perfume, Tenis } from "./types";

export function perfumeToCartItem(perfume: Perfume): CartItem {
  return {
    tipo: "perfume",
    id: `perfume:${perfume.id}`,
    slug: perfume.slug,
    nombre: perfume.nombre,
    marca: perfume.marca,
    precio: perfume.precio,
    imagenUrl: perfume.imagenUrl,
  };
}

export function tenisToCartItem(tenis: Tenis): CartItem {
  return {
    tipo: "tenis",
    id: `tenis:${tenis.id}`,
    slug: tenis.slug,
    nombre: tenis.nombre,
    precio: tenis.precio,
    imagenUrl: tenis.imagenUrl,
  };
}
