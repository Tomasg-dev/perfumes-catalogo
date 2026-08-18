import type { Perfume } from "./types";

function normalizeNote(note: string): string {
  return note.trim().toLowerCase();
}

function allNotes(perfume: Perfume): Set<string> {
  return new Set(
    [...perfume.notasSalida, ...perfume.notasCorazon, ...perfume.notasFondo].map(
      normalizeNote
    )
  );
}

/**
 * Puntúa la afinidad con `perfume` por notas olfativas compartidas
 * (lo que más importa para "también te podría gustar"), y en menor medida
 * por categoría y marca. Si no hay suficientes coincidencias, completa con
 * perfumes de la misma categoría para nunca dejar la sección vacía.
 */
export function getRelatedPerfumes(
  perfume: Perfume,
  perfumes: Perfume[],
  limit = 4
): Perfume[] {
  const notas = allNotes(perfume);
  const candidatos = perfumes.filter((p) => p.id !== perfume.id);

  const puntuados = candidatos
    .map((p) => {
      let score = 0;
      for (const nota of allNotes(p)) {
        if (notas.has(nota)) score += 3;
      }
      if (p.categoria === perfume.categoria) score += 2;
      if (p.marca === perfume.marca) score += 1;
      return { perfume: p, score };
    })
    .sort((a, b) => b.score - a.score);

  const conAfinidad = puntuados.filter((p) => p.score > 0).map((p) => p.perfume);
  if (conAfinidad.length >= limit) return conAfinidad.slice(0, limit);

  const elegidosIds = new Set(conAfinidad.map((p) => p.id));
  const mismaCategoria = candidatos.filter(
    (p) => p.categoria === perfume.categoria && !elegidosIds.has(p.id)
  );

  const relleno = [...conAfinidad, ...mismaCategoria];
  const rellenoIds = new Set(relleno.map((p) => p.id));
  const resto = candidatos.filter((p) => !rellenoIds.has(p.id));

  return [...relleno, ...resto].slice(0, limit);
}
