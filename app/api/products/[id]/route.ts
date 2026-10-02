import { sb, isAdmin, denied, clean } from '@/lib/db'
export const dynamic = 'force-dynamic'
type Ctx = { params: { id: string } }

export async function GET(_: Request, { params }: Ctx) {
  const { data } = await sb.from('products').select('*').eq('id', params.id).maybeSingle()
  return data ? Response.json(data) : Response.json({ error: 'Não encontrado' }, { status: 404 })
}
export async function PUT(req: Request, { params }: Ctx) {
  if (!isAdmin(req)) return denied()
  const { error } = await sb.from('products').update(clean(await req.json())).eq('id', params.id)
  return error ? Response.json({ error: error.message }, { status: 500 }) : Response.json({ ok: true })
}
export async function DELETE(req: Request, { params }: Ctx) {
  if (!isAdmin(req)) return denied()
  await sb.from('products').delete().eq('id', params.id)
  return Response.json({ ok: true })
}
