import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import type { Categoria, Perfume, PerfumeAdmin } from "./types";

interface PerfumeRow {
  id: string;
  slug: string;
  nombre: string;
  marca: string;
  precio: number | null;
  ml: number;
  categoria: Categoria;
  notas_salida: string[];
  notas_corazon: string[];
  notas_fondo: string[];
  descripcion: string;
  imagen_url: string | null;
  destacado: boolean;
  activo: boolean;
}

function mapRowToPerfume(row: PerfumeRow): Perfume {
  return {
    id: row.id,
    slug: row.slug,
    nombre: row.nombre,
    marca: row.marca,
    precio: row.precio,
    ml: row.ml,
    categoria: row.categoria,
    notasSalida: row.notas_salida,
    notasCorazon: row.notas_corazon,
    notasFondo: row.notas_fondo,
    descripcion: row.descripcion,
    imagenUrl: row.imagen_url,
    destacado: row.destacado,
  };
}

// Catálogo público: sin sesión, RLS solo deja ver activo = true. Cliente sin
// cookies a propósito (ver lib/supabase/public.ts) para no forzar renderizado
// dinámico en las páginas que la usan (home, /perfumes, /producto/[slug]).
export async function getPerfumes(): Promise<Perfume[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("perfumes")
    .select("*")
    .order("destacado", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as PerfumeRow[]).map(mapRowToPerfume);
}

export async function getPerfumeBySlug(slug: string): Promise<Perfume | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("perfumes")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRowToPerfume(data as PerfumeRow) : null;
}

// Para el panel admin: el rol autenticado ve todos los registros (activos e
// inactivos) por la política RLS "perfumes_admin_all"; no se filtra por activo.
export async function getAllPerfumesAdmin(): Promise<PerfumeAdmin[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("perfumes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as PerfumeRow[]).map((row) => ({ ...mapRowToPerfume(row), activo: row.activo }));
}

export async function getPerfumeByIdAdmin(id: string): Promise<PerfumeAdmin | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("perfumes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data ? { ...mapRowToPerfume(data as PerfumeRow), activo: (data as PerfumeRow).activo } : null;
}
