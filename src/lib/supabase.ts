import { createClient } from '@supabase/supabase-js'
import { env } from './env'

// Cliente único de Supabase para toda la app.
// Cuando la base de datos esté creada, genera los tipos con:
//   npx supabase gen types typescript --project-id <id> > src/lib/database.types.ts
// y cámbialo por createClient<Database>(...).
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
