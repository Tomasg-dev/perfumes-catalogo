import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import type { Tenis, TenisAdmin } from "./types";
import type { ColorTenis } from "./colores-tenis";

interface TenisRow {
  id: string;
  slug: string;
  nombre: string;
  categoria: "hombre" | "mujer" | "unisex";
  color: string | null;
  precio: number | null;
  imagen_url: string;
  destacado: boolean;
  activo: boolean;
}

function mapRowToTenis(row: TenisRow): Tenis {
  return {
    id: row.id,
    slug: row.slug,
    nombre: row.nombre,
    categoria: row.categoria,
    color: row.color as ColorTenis | null,
    precio: row.precio,
    imagenUrl: row.imagen_url,
    destacado: row.destacado,
  };
}

// Para el panel admin: el rol autenticado ve todos los registros (activos e
// inactivos) por la política RLS "tenis_admin_all"; no se filtra por activo.
export async function getAllTenisAdmin(): Promise<TenisAdmin[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tenis")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data as TenisRow[]).map((row) => ({ ...mapRowToTenis(row), activo: row.activo }));
}

export const TENIS_POR_PAGINA = 24;

export type OrdenTenis = "destacados" | "precio-asc" | "precio-desc";

export interface TenisPageParams {
  categoria?: "hombre" | "mujer" | "unisex";
  q?: string;
  orden?: OrdenTenis;
  page?: number;
}

export interface TenisPageResult {
  items: Tenis[];
  total: number;
  page: number;
  totalPages: number;
}

// Página pública: sin sesión de admin, RLS solo deja ver activo = true.
// Cliente sin cookies a propósito — así esta lectura no fuerza renderizado
// dinámico en las páginas que la usan (home, /tenis, /tenis/[slug]).
export async function getTenisPage(params: TenisPageParams): Promise<TenisPageResult> {
  const supabase = createPublicClient();
  const page = Math.max(1, params.page ?? 1);
  const from = (page - 1) * TENIS_POR_PAGINA;
  const to = from + TENIS_POR_PAGINA - 1;

  let query = supabase.from("tenis").select("*", { count: "exact" });

  if (params.categoria) query = query.eq("categoria", params.categoria);
  if (params.q) query = query.ilike("nombre", `%${params.q}%`);

  if (params.orden === "precio-asc") {
    query = query.order("precio", { ascending: true, nullsFirst: false });
  } else if (params.orden === "precio-desc") {
    query = query.order("precio", { ascending: false, nullsFirst: false });
  } else {
    query = query
      .order("destacado", { ascending: false })
      .order("created_at", { ascending: false });
  }

  const { data, count, error } = await query.range(from, to);
  if (error) throw error;

  const total = count ?? 0;
  return {
    items: (data as TenisRow[]).map(mapRowToTenis),
    total,
    page,
    totalPages: Math.max(1, Math.ceil(total / TENIS_POR_PAGINA)),
  };
}

// Para el sitemap: todos los slugs públicos (RLS ya filtra activo = true).
export async function getAllTenisSlugs(): Promise<
  { slug: string; createdAt: string }[]
> {
  const supabase = createPublicClient();
  const { data, error } = await supabase.from("tenis").select("slug, created_at");

  if (error) throw error;
  return (data as { slug: string; created_at: string }[]).map((row) => ({
    slug: row.slug,
    createdAt: row.created_at,
  }));
}

export async function getTenisBySlug(slug: string): Promise<Tenis | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("tenis")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data ? mapRowToTenis(data as TenisRow) : null;
}
