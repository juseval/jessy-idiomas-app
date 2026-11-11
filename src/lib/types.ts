// Tipos de dominio compartidos. Reflejan el modelo lógico (supabase/migrations).

export type Role = 'master' | 'teacher' | 'student'

export interface Profile {
  id: string
  doc_type: 'CC' | 'TI'
  doc_number: string
  first_name: string
  last_name: string
  role: Role
  is_activated: boolean
  active: boolean
}

/** Ruta de inicio de cada rol después de iniciar sesión. */
export const HOME_BY_ROLE: Record<Role, string> = {
  master: '/director',
  teacher: '/profesor',
  student: '/estudiante',
}
