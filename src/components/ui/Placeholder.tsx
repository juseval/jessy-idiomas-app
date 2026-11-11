import type { ReactNode } from 'react'

/**
 * Pantalla temporal para secciones que aún no se construyen.
 * `card` es el número de la tarjeta en Trello (ej. "3.1").
 */
export function Placeholder({
  title,
  card,
  children,
}: {
  title: string
  card: string
  children?: ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <h1 className="font-display text-3xl font-extrabold">{title}</h1>
      <div className="rounded-2xl border border-dashed border-line bg-white p-6 text-ink-soft">
        <p>
          Pendiente · tarjeta <strong className="text-brand">{card}</strong> en Trello.
        </p>
        {children}
      </div>
    </section>
  )
}
