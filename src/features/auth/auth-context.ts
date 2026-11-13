import { createContext, useContext } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { Profile, Role } from '@/lib/types'

export interface AuthState {
  session: Session | null
  profile: Profile | null
  loading: boolean
  signIn: (document: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  /** Solo existe en modo demo. */
  signInAsDemo?: (role: Role) => void
}

export const AuthContext = createContext<AuthState | null>(null)

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  return ctx
}
