import type { Perfume } from "./types";
import catalogo from "@/data/perfumes.sample.json";

export async function getPerfumes(): Promise<Perfume[]> {
  return catalogo as Perfume[];
}

export async function getPerfumeBySlug(slug: string): Promise<Perfume | null> {
  const perfumes = await getPerfumes();
  return perfumes.find((p) => p.slug === slug) ?? null;
}
