import { useState } from 'react'
import { maskDocument, normalizeDocument } from '@/lib/document'

interface Props {
  id: string
  label: string
  value: string
  onChange: (digits: string) => void
  hint?: string
}

/**
 * Campo de documento: se ve completo mientras se escribe y
 * al salir del campo muestra solo los últimos 4 dígitos.
 */
export function DocumentInput({ id, label, value, onChange, hint }: Props) {
  const [focused, setFocused] = useState(false)
  const shown = focused ? value : maskDocument(value)

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={shown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onChange(normalizeDocument(e.target.value))}
        className="min-h-12 rounded-lg border border-line bg-white px-3.5 text-base tracking-wide outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
      />
      {hint && <span className="text-xs text-muted">{hint}</span>}
    </div>
  )
}
