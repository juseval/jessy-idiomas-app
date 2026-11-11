export function FullScreenLoader() {
  return (
    <div role="status" className="grid min-h-screen place-items-center">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-brand-soft border-t-brand" />
      <span className="sr-only">Cargando…</span>
    </div>
  )
}
