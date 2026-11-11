import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/auth-context'

const tabs = [
  { to: '/estudiante', label: 'Inicio', end: true },
  { to: '/estudiante/progreso', label: 'Mi progreso' },
  { to: '/estudiante/perfil', label: 'Perfil' },
]

export function StudentLayout() {
  const { profile } = useAuth()
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-surface">
      <header className="bg-ink px-5 pb-6 pt-5 text-white">
        <img src="/favicon.svg" alt="" className="h-10 w-10" />
        <h1 className="mt-3 font-display text-2xl font-extrabold">Hola, {profile?.first_name}</h1>
      </header>
      <main className="flex-1 p-5">
        <Outlet />
      </main>
      <nav
        aria-label="Navegación"
        className="sticky bottom-0 flex justify-around border-t border-line bg-white pb-5 pt-2"
      >
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `flex min-h-11 min-w-16 items-center justify-center text-sm ${isActive ? 'font-bold text-brand' : 'font-semibold text-muted'}`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
