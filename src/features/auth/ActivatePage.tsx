import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { DocumentInput } from '@/components/ui/DocumentInput'
import { TextInput } from '@/components/ui/TextInput'
import { isValidDocument } from '@/lib/document'
import { supabase } from '@/lib/supabase'

/**
 * Activación de cuenta (tarjeta 2.3).
 * El director crea al estudiante y la plataforma le genera un código de 6 dígitos.
 * El estudiante entra aquí con documento + código y crea su contraseña.
 * La validación real ocurre en la Edge Function `activate-account`.
 */
export function ActivatePage() {
  const [document, setDocument] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (!isValidDocument(document)) return setError('Revisa el número de documento.')
    if (!/^\d{6}$/.test(code)) return setError('El código tiene 6 dígitos.')
    if (password.length < 8) return setError('La contraseña debe tener mínimo 8 caracteres.')
    if (password !== confirm) return setError('Las contraseñas no coinciden.')

    setStatus('sending')
    const { error: fnError } = await supabase.functions.invoke('activate-account', {
      body: { document, code, password },
    })
    if (fnError) {
      setStatus('idle')
      setError('No pudimos activar la cuenta. Revisa el documento y el código.')
      return
    }
    setStatus('done')
  }

  if (status === 'done') {
    return (
      <main className="grid min-h-screen place-items-center p-6">
        <div className="flex max-w-md flex-col gap-4 rounded-2xl bg-white p-6 text-center shadow-xl">
          <h1 className="font-display text-2xl font-extrabold">¡Cuenta activada!</h1>
          <p>Ya puedes entrar con tu documento y tu nueva contraseña.</p>
          <Link to="/login" className="font-bold text-brand">
            Ir a ingresar →
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="grid min-h-screen place-items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-white p-6 shadow-xl"
      >
        <h1 className="font-display text-2xl font-extrabold">Activar mi cuenta</h1>
        <DocumentInput
          id="document"
          label="Cédula o tarjeta de identidad"
          value={document}
          onChange={setDocument}
        />
        <TextInput
          id="code"
          label="Código de activación"
          inputMode="numeric"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
        />
        <TextInput
          id="password"
          label="Crea tu contraseña"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextInput
          id="confirm"
          label="Repite la contraseña"
          type="password"
          autoComplete="new-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        {error && (
          <p role="alert" className="rounded-lg bg-accent-soft px-3 py-2 text-sm font-semibold text-accent">
            {error}
          </p>
        )}
        <Button type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Activando…' : 'Activar'}
        </Button>
        <Link to="/login" className="text-center text-sm font-semibold text-brand">
          ← Volver a ingresar
        </Link>
      </form>
    </main>
  )
}
