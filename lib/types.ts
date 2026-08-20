import type { ColorTenis } from "./colores-tenis";

export type Categoria = "hombre" | "mujer" | "unisex";
export type CategoriaTenis = "hombre" | "mujer" | "unisex";

export interface Tenis {
  id: string;
  slug: string;
  nombre: string;
  categoria: CategoriaTenis;
  color: ColorTenis | null;
  precio: number | null;
  imagenUrl: string | null;
  destacado: boolean;
}

export type TenisAdmin = Tenis & { activo: boolean };

export interface Perfume {
  id: string;
  slug: string;
  nombre: string;
  marca: string;
  precio: number | null;
  ml: number;
  categoria: Categoria;
  notasSalida: string[];
  notasCorazon: string[];
  notasFondo: string[];
  descripcion: string;
  imagenUrl: string | null;
  destacado: boolean;
}

export type PerfumeAdmin = Perfume & { activo: boolean };

export type ProductType = "perfume" | "tenis";

export interface CartItem {
  tipo: ProductType;
  id: string;
  slug: string;
  nombre: string;
  marca?: string;
  precio: number | null;
  imagenUrl: string | null;
}
