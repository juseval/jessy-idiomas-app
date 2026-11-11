// Copia de src/lib/document.ts para las Edge Functions (Deno no lee src/).
// Si cambias una, cambia la otra.
export const INTERNAL_EMAIL_DOMAIN = 'usuarios.jessyidiomas.app'

export function normalizeDocument(value: string): string {
  return String(value ?? '').replace(/\D/g, '')
}

export function isValidDocument(value: string): boolean {
  const d = normalizeDocument(value)
  return d.length >= 6 && d.length <= 12
}

export function documentToEmail(value: string): string {
  return `${normalizeDocument(value)}@${INTERNAL_EMAIL_DOMAIN}`
}

export async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export function randomCode(): string {
  const n = crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000
  return n.toString().padStart(6, '0')
}
