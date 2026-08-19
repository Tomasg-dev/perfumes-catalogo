"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slugify";
import type { CategoriaTenis } from "@/lib/types";
import type { ColorTenis } from "@/lib/colores-tenis";

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No autenticado");
  return supabase;
}

export interface NuevoTenis {
  nombre: string;
  categoria: CategoriaTenis;
  color: ColorTenis | null;
  precio: number | null;
  imagenUrl: string;
}

export async function createTenisBatch(items: NuevoTenis[]) {
  const supabase = await requireAdmin();

  const rows = items.map((item) => ({
    slug: `${slugify(item.nombre)}-${Math.random().toString(36).slice(2, 8)}`,
    nombre: item.nombre,
    categoria: item.categoria,
    color: item.color,
    precio: item.precio,
    imagen_url: item.imagenUrl,
  }));

  const { error } = await supabase.from("tenis").insert(rows);
  if (error) throw error;

  revalidatePath("/admin/tenis");
  revalidatePath("/tenis");
  revalidatePath("/tenis/[slug]", "page");
  revalidatePath("/");
}

export async function updateTenis(id: string, formData: FormData) {
  const supabase = await requireAdmin();

  const nombre = String(formData.get("nombre") ?? "").trim();
  const categoria = String(formData.get("categoria"));
  const colorRaw = String(formData.get("color") ?? "");
  const precioRaw = String(formData.get("precio") ?? "").trim();
  const activo = formData.get("activo") === "on";
  const destacado = formData.get("destacado") === "on";

  if (!nombre) throw new Error("El nombre es obligatorio");

  const { error } = await supabase
    .from("tenis")
    .update({
      nombre,
      categoria,
      color: colorRaw || null,
      precio: precioRaw ? Number(precioRaw) : null,
      activo,
      destacado,
    })
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/admin/tenis");
  revalidatePath("/tenis");
  revalidatePath("/tenis/[slug]", "page");
  revalidatePath("/");
}

export async function deleteTenis(id: string, imagenUrl: string) {
  const supabase = await requireAdmin();

  const { error } = await supabase.from("tenis").delete().eq("id", id);
  if (error) throw error;

  const marker = "/object/public/tenis/";
  const idx = imagenUrl.indexOf(marker);
  if (idx !== -1) {
    const path = imagenUrl.slice(idx + marker.length);
    await supabase.storage.from("tenis").remove([path]);
  }

  revalidatePath("/admin/tenis");
  revalidatePath("/tenis");
  revalidatePath("/tenis/[slug]", "page");
  revalidatePath("/");
}
