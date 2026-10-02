import { sb, isAdmin, denied } from '@/lib/db'

export async function POST(req: Request) {
  if (!isAdmin(req)) return denied()
  const file = (await req.formData()).get('file') as File
  const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
  const { error } = await sb.storage.from('products').upload(name, file, { contentType: 'image/jpeg' })
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ url: sb.storage.from('products').getPublicUrl(name).data.publicUrl })
}
