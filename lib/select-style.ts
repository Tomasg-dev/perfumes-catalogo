import type { CSSProperties } from "react";

// Flecha dorada personalizada para <select>, reemplazando la del navegador
// (que ignora el tema oscuro y se ve blanca). Se comparte para que el look
// sea idéntico en los filtros públicos y en los selects del panel admin.
export const GOLD_CHEVRON_STYLE: CSSProperties = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%23a9884f' stroke-width='1.5'%3E%3Cpath d='M5 7.5 10 12.5 15 7.5'/%3E%3C/svg%3E\")",
};

// Los navegadores renderizan el <option> con sus propios colores nativos
// salvo que se les fuerce explícitamente el color de fondo/texto del tema.
export const SELECT_OPTION_CLASSNAME = "bg-[var(--color-paper)] text-[var(--color-ink)]";
