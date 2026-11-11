import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { documentToEmail } from '@/lib/document'
import type { Profile } from '@/lib/types'
import { AuthContext, type AuthState } from './auth-context'

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, doc_type, doc_number, first_name, last_name, role, is_activated, active')
    .eq('id', userId)
    .single()
  if (error) {
    console.error('No se pudo cargar el perfil', error)
    return null
  }
  return data as Profile
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load(next: Session | null) {
      setSession(next)
      setProfile(next ? await fetchProfile(next.user.id) : null)
      if (!cancelled) setLoading(false)
    }

    supabase.auth.getSession().then(({ data }) => load(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      // Diferimos la consulta para no bloquear el callback de Supabase.
      setTimeout(() => load(next), 0)
    })

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (document: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: documentToEmail(document),
      password,
    })
    if (error) throw new Error('Documento o contraseña incorrectos')
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
  }, [])

  const value = useMemo<AuthState>(
    () => ({ session, profile, loading, signIn, signOut }),
    [session, profile, loading, signIn, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
