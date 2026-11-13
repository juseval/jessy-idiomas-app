import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/auth-context'

const links = [
  { to: '/director', label: 'Inicio', end: true },
  { to: '/director/estudiantes', label: 'Estudiantes' },
  { to: '/director/grupos', label: 'Grupos y profesores' },
  { to: '/director/planificacion', label: 'Planificación semanal' },
  { to: '/director/pagos', label: 'Pagos' },
  { to: '/director/curriculo', label: 'Currículo A1–C1' },
  { to: '/director/reportes', label: 'Reportes' },
]

export function DirectorLayout() {
  const { profile, signOut } = useAuth()
  return (
    <div className="flex min-h-screen flex-wrap">
      <nav aria-label="Menú principal" className="flex flex-[1_1_240px] flex-col gap-6 bg-ink p-4 text-white">
        <div className="flex items-center gap-3 px-2">
          <img src="/favicon.svg" alt="" className="h-11 w-11" />
          <div>
            <p className="font-display font-extrabold tracking-wide">JESSY IDIOMAS</p>
            <p className="text-xs text-slate-400">Panel del director</p>
          </div>
        </div>
        <ul className="flex flex-col gap-1">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `block rounded-lg px-3 py-3 font-medium ${isActive ? 'bg-brand font-bold text-white' : 'text-slate-300 hover:bg-white/10'}`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-col gap-2 px-2 text-sm text-slate-400">
          <span>{profile?.first_name}</span>
          <button onClick={signOut} className="text-left font-semibold text-white hover:underline">
            Cerrar sesión
          </button>
        </div>
      </nav>
      <main className="min-w-0 flex-[999_1_560px] p-6 sm:p-8">
        <Outlet />
      </main>
    </div>
  )
}
