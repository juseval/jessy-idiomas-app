// Edge Function: activación de cuenta (pública, sin sesión).
// Tarjeta 2.3 en Trello.
//
// POST { document, code, password }
// Valida el código de 6 dígitos que entregó la academia y fija la contraseña.
import { createClient } from 'jsr:@supabase/supabase-js@2'
import { corsHeaders, json } from '../_shared/cors.ts'
import { isValidDocument, normalizeDocument, sha256 } from '../_shared/document.ts'

const MAX_ATTEMPTS = 5
const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)

// Respuesta genérica: no revelamos si el documento existe o no.
const fail = () => json({ error: 'Documento o código inválido' }, 400)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })
  if (req.method !== 'POST') return json({ error: 'Método no permitido' }, 405)

  const { document, code, password } = await req.json().catch(() => ({}))
  const doc = normalizeDocument(document)
  if (!isValidDocument(doc) || !/^\d{6}$/.test(String(code)) || String(password ?? '').length < 8) {
    return fail()
  }

  const { data: profile } = await admin
    .from('profiles')
    .select('id, active')
    .eq('doc_number', doc)
    .maybeSingle()
  if (!profile?.active) return fail()

  const { data: activation } = await admin
    .from('account_activations')
    .select('code_hash, expires_at, attempts')
    .eq('profile_id', profile.id)
    .maybeSingle()
  if (!activation) return fail()
  if (activation.attempts >= MAX_ATTEMPTS || new Date(activation.expires_at) < new Date()) {
    return json({ error: 'El código venció. Pide uno nuevo en la academia.' }, 400)
  }

  if ((await sha256(String(code))) !== activation.code_hash) {
    await admin
      .from('account_activations')
      .update({ attempts: activation.attempts + 1 })
      .eq('profile_id', profile.id)
    return fail()
  }

  const { error } = await admin.auth.admin.updateUserById(profile.id, { password })
  if (error) return json({ error: 'No se pudo guardar la contraseña' }, 500)

  await admin
    .from('profiles')
    .update({ is_activated: true, data_consent_at: new Date().toISOString() })
    .eq('id', profile.id)
  await admin.from('account_activations').delete().eq('profile_id', profile.id)

  return json({ ok: true })
})
