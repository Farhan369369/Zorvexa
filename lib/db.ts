import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// Só corre no servidor: a chave secreta nunca vai para o browser
export const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!, {
  auth: { persistSession: false },
})

export const token = () => crypto.createHash('sha256').update('zx:' + (process.env.ADMIN_PASSWORD || '')).digest('hex')
export const isAdmin = (req: Request) =>
  !!process.env.ADMIN_PASSWORD && (req.headers.get('cookie') || '').includes('zx-admin=' + token())
export const denied = () => Response.json({ error: 'Sem permissão' }, { status: 401 })
export const clean = (b: any) => ({
  name: String(b.name || ''), description: String(b.description || ''),
  price: Number(b.price) || 0, category: String(b.category || 'Outros'),
  image_url: String(b.image_url || ''), stock: Math.max(0, Math.floor(Number(b.stock) || 0)),
  available: !!b.available,
})
