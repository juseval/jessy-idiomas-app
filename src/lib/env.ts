// Variables de entorno públicas (las que empiezan por VITE_ llegan al navegador).
// NUNCA pongas aquí la service_role key de Supabase: esa solo vive en Edge Functions.

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}. Copia .env.example a .env.local y complétala.`)
  }
  return value
}

export const env = {
  supabaseUrl: required('VITE_SUPABASE_URL', import.meta.env.VITE_SUPABASE_URL),
  supabaseAnonKey: required('VITE_SUPABASE_ANON_KEY', import.meta.env.VITE_SUPABASE_ANON_KEY),
}
