export const COLORES_TENIS = [
  "blanco",
  "negro",
  "gris",
  "azul",
  "rojo",
  "verde",
  "amarillo",
  "café",
  "multicolor",
] as const;

export type ColorTenis = (typeof COLORES_TENIS)[number];
