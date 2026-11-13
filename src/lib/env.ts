// Variables de entorno públicas (las que empiezan por VITE_ llegan al navegador).
// NUNCA pongas aquí la service_role key de Supabase: esa solo vive en Edge Functions.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? ''

/** true si faltan los datos de Supabase (no existe .env.local o está incompleto). */
const missingConfig = !supabaseUrl || !supabaseAnonKey

if (missingConfig) {
  console.warn(
    '[Jessy Idiomas] Faltan VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. ' +
      'Copia .env.example a .env.local. Mientras tanto, en desarrollo se usa el modo demo.',
  )
}

export const env = {
  // Valores de relleno para que la app cargue aunque falte la configuración.
  supabaseUrl: supabaseUrl || 'http://127.0.0.1:54321',
  supabaseAnonKey: supabaseAnonKey || 'sin-configurar',
  missingConfig,
  /**
   * Modo demo: entra por rol sin base de datos. Solo en `npm run dev`, nunca en producción.
   * Se activa con VITE_DEMO_MODE=true o, en desarrollo, si falta la configuración de Supabase.
   */
  demoMode: import.meta.env.DEV && (import.meta.env.VITE_DEMO_MODE === 'true' || missingConfig),
}
