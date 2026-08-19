import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cliente sin cookies para lecturas públicas del catálogo (RLS ya limita a
// activo = true para el rol anónimo, con o sin cookies). Tocar cookies()
// fuerza a Next a renderizar la ruta completa en cada request sin caché —
// este cliente evita eso para las lecturas que no dependen de sesión.
// Para todo lo que sí depende de sesión (admin), usar lib/supabase/server.ts.
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
