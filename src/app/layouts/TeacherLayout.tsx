import { Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/auth-context'

export function TeacherLayout() {
  const { profile, signOut } = useAuth()
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 bg-ink px-6 py-3 text-white">
        <div className="flex items-center gap-3">
          <img src="/favicon.svg" alt="" className="h-10 w-10" />
          <span className="font-display font-extrabold tracking-wide">JESSY IDIOMAS</span>
          <span className="text-sm text-slate-400">· Profesores</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span>{profile?.first_name}</span>
          <button onClick={signOut} className="font-semibold hover:underline">
            Salir
          </button>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl p-6">
        <Outlet />
      </main>
    </div>
  )
}
