import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { HOME_BY_ROLE, type Role } from '@/lib/types'
import { FullScreenLoader } from '@/components/ui/FullScreenLoader'
import { useAuth } from './auth-context'

/**
 * Protege una sección por rol. Ojo: esto es solo comodidad de interfaz.
 * La seguridad real está en las políticas RLS de la base de datos.
 */
export function RequireRole({ roles, children }: { roles: Role[]; children: ReactNode }) {
  const { session, profile, loading } = useAuth()
  const location = useLocation()

  if (loading) return <FullScreenLoader />
  if (!session) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (!profile || !profile.active) return <Navigate to="/login" replace />
  if (!roles.includes(profile.role)) return <Navigate to={HOME_BY_ROLE[profile.role]} replace />

  return <>{children}</>
}

/** Redirige al inicio de cada rol (o al login si no hay sesión). */
export function RoleHomeRedirect() {
  const { session, profile, loading } = useAuth()
  if (loading) return <FullScreenLoader />
  if (!session || !profile) return <Navigate to="/login" replace />
  return <Navigate to={HOME_BY_ROLE[profile.role]} replace />
}
