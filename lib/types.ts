export type Categoria = "hombre" | "mujer" | "unisex";

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

export type CartItem = Pick<
  Perfume,
  "id" | "slug" | "nombre" | "marca" | "precio" | "imagenUrl"
>;
