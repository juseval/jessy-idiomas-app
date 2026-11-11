import { describe, expect, it } from 'vitest'
import {
  documentToEmail,
  INTERNAL_EMAIL_DOMAIN,
  isValidDocument,
  maskDocument,
  normalizeDocument,
} from './document'

describe('normalizeDocument', () => {
  it('quita puntos, espacios y letras', () => {
    expect(normalizeDocument('1.036.000.000')).toBe('1036000000')
    expect(normalizeDocument(' 10 36 abc ')).toBe('1036')
  })
})

describe('isValidDocument', () => {
  it('acepta entre 6 y 12 dígitos', () => {
    expect(isValidDocument('123456')).toBe(true)
    expect(isValidDocument('1036003768')).toBe(true)
  })
  it('rechaza documentos muy cortos o muy largos', () => {
    expect(isValidDocument('12345')).toBe(false)
    expect(isValidDocument('1234567890123')).toBe(false)
  })
})

describe('maskDocument', () => {
  it('muestra solo los últimos 4 dígitos', () => {
    expect(maskDocument('1036003768')).toBe('••••••3768')
  })
  it('no enmascara si el valor es corto', () => {
    expect(maskDocument('123')).toBe('123')
  })
})

describe('documentToEmail', () => {
  it('convierte el documento en el correo interno', () => {
    expect(documentToEmail('1.036.003.768')).toBe(`1036003768@${INTERNAL_EMAIL_DOMAIN}`)
  })
  it('lanza error con un documento inválido', () => {
    expect(() => documentToEmail('12')).toThrow('Documento inválido')
  })
})
