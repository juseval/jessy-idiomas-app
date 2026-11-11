import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { DocumentInput } from '@/components/ui/DocumentInput'
import { TextInput } from '@/components/ui/TextInput'
import { isValidDocument } from '@/lib/document'
import { HOME_BY_ROLE, type Role } from '@/lib/types'
import { useAuth } from './auth-context'

const DEMO_ROLES: [Role, string][] = [
  ['master', 'Director'],
  ['teacher', 'Profesor'],
  ['student', 'Estudiante'],
]

export function LoginPage() {
  const { signIn, signInAsDemo, session, profile } = useAuth()
  const [document, setDocument] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (session && profile) return <Navigate to={HOME_BY_ROLE[profile.role]} replace />

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!isValidDocument(document)) {
      setError('Revisa el número de documento.')
      return
    }
    setSubmitting(true)
    try {
      await signIn(document, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-surface">
      <div className="flex flex-col items-center gap-3 border-b-4 border-accent bg-ink px-6 pb-20 pt-12 text-center">
        <Link to="/" aria-label="Volver al inicio">
          <img src="/favicon.svg" alt="" className="h-24 w-24" />
        </Link>
        <p className="font-display text-xl font-extrabold tracking-wide text-white">JESSY IDIOMAS</p>
        <p className="text-sm text-slate-300">Practica lo que ves en clase, cuando quieras</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mx-5 -mt-12 flex max-w-md flex-col gap-4 self-center rounded-2xl bg-white p-6 shadow-xl sm:w-full"
      >
        <h1 className="font-display text-2xl font-extrabold">Ingresar</h1>
        <DocumentInput
          id="document"
          label="Número de documento"
          value={document}
          onChange={setDocument}
          hint="Por seguridad solo mostramos los últimos 4 dígitos."
        />
        <TextInput
          id="password"
          label="Contraseña"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && (
          <p role="alert" className="rounded-lg bg-accent-soft px-3 py-2 text-sm font-semibold text-accent">
            {error}
          </p>
        )}
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Ingresando…' : 'Entrar'}
        </Button>
        <p className="text-center text-sm text-muted">
          ¿Olvidaste tu contraseña? Pídele a la academia que la restablezca.
        </p>
      </form>

      {signInAsDemo && (
        <div className="mx-5 mt-8 flex max-w-md flex-col gap-3 self-center rounded-2xl border-2 border-dashed border-warn bg-warn-soft p-4 sm:w-full">
          <span className="font-bold text-warn">Modo demo · solo desarrollo</span>
          <span className="text-sm">Entra sin base de datos para ver las pantallas de cada rol.</span>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_ROLES.map(([role, label]) => (
              <Button key={role} type="button" variant="secondary" onClick={() => signInAsDemo(role)}>
                {label}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="mx-5 my-8 flex max-w-md flex-col gap-1 self-center rounded-2xl bg-brand-soft p-4 sm:w-full">
        <span className="font-bold text-brand-dark">¿Primera vez?</span>
        <span className="text-sm">Activa tu cuenta con tu documento y el código que te dio la academia.</span>
        <Link to="/activar" className="font-bold text-brand">
          Activar mi cuenta →
        </Link>
      </div>
    </main>
  )
}
