import { useCallback, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import type { Profile, Role } from '@/lib/types'
import { AuthContext, type AuthState } from './auth-context'

// Proveedor falso para ver las pantallas sin Supabase. Solo se usa con VITE_DEMO_MODE=true en `npm run dev`.

const STORAGE_KEY = 'jessy-demo-role'

const DEMO_PROFILES: Record<Role, Profile> = {
  master: demoProfile('master', 'Jessy', 'Directora', '1036003768'),
  teacher: demoProfile('teacher', 'Laura', 'Gómez', '1020304050'),
  student: demoProfile('student', 'Sara', 'Restrepo', '1001234567'),
}

function demoProfile(role: Role, first_name: string, last_name: string, doc_number: string): Profile {
  return {
    id: `demo-${role}`,
    doc_type: 'CC',
    doc_number,
    first_name,
    last_name,
    role,
    is_activated: true,
    active: true,
  }
}

function readStoredRole(): Role | null {
  try {
    const value = sessionStorage.getItem(STORAGE_KEY)
    return value && value in DEMO_PROFILES ? (value as Role) : null
  } catch {
    return null
  }
}

export function DemoAuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(readStoredRole)

  const signInAsDemo = useCallback((next: Role) => {
    try {
      sessionStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* sin almacenamiento: la demo igual funciona hasta recargar */
    }
    setRole(next)
  }, [])

  const signIn = useCallback(async () => {
    throw new Error('Modo demo: usa los botones de Director, Profesor o Estudiante.')
  }, [])

  const signOut = useCallback(async () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      /* nada */
    }
    setRole(null)
  }, [])

  const value = useMemo<AuthState>(() => {
    const profile = role ? DEMO_PROFILES[role] : null
    const session = profile ? ({ user: { id: profile.id } } as unknown as Session) : null
    return { session, profile, loading: false, signIn, signOut, signInAsDemo }
  }, [role, signIn, signOut, signInAsDemo])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
