// Utilidades para el documento de identidad (cédula o tarjeta de identidad).
//
// Supabase Auth trabaja con correo. Para que el usuario entre con su documento,
// cada documento se convierte en un correo interno que el usuario nunca ve.

export const INTERNAL_EMAIL_DOMAIN = 'usuarios.jessyidiomas.app'

export type DocumentType = 'CC' | 'TI'

/** Deja solo los dígitos: "1.036.000.000" → "1036000000". */
export function normalizeDocument(value: string): string {
  return value.replace(/\D/g, '')
}

/** Un documento colombiano válido para la plataforma: entre 6 y 12 dígitos. */
export function isValidDocument(value: string): boolean {
  const digits = normalizeDocument(value)
  return digits.length >= 6 && digits.length <= 12
}

/** Muestra solo los últimos 4 dígitos: "1036003768" → "••••••3768". */
export function maskDocument(value: string, visible = 4): string {
  const digits = normalizeDocument(value)
  if (digits.length <= visible) return digits
  return '•'.repeat(digits.length - visible) + digits.slice(-visible)
}

/** Documento → correo interno de Supabase Auth. */
export function documentToEmail(value: string): string {
  const digits = normalizeDocument(value)
  if (!isValidDocument(digits)) {
    throw new Error('Documento inválido')
  }
  return `${digits}@${INTERNAL_EMAIL_DOMAIN}`
}
