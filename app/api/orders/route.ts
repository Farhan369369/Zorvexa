import { sb, isAdmin, denied } from '@/lib/db'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  if (!isAdmin(req)) return denied()
  const { data } = await sb.from('orders').select('*').order('created_at', { ascending: false })
  return Response.json(data || [])
}

// Cliente cria pedido: preços e stock são validados no servidor
export async function POST(req: Request) {
  const b = await req.json()
  if (!b.customer_name || !b.phone || !Array.isArray(b.items) || !b.items.length)
    return Response.json({ error: 'Preencha o nome e o telefone.' }, { status: 400 })
  const { data: prods } = await sb.from('products').select('*').in('id', b.items.map((i: any) => String(i.id)))
  const items: any[] = []
  for (const it of b.items) {
    const p = prods?.find(x => x.id === it.id)
    const qty = Math.floor(Number(it.qty))
    if (!p || !p.available || qty < 1 || p.stock < qty)
      return Response.json({ error: `Sem stock suficiente: ${p?.name || 'produto'}` }, { status: 400 })
    items.push({ id: p.id, name: p.name, price: Number(p.price), qty, stock: p.stock })
  }
  const { error } = await sb.from('orders').insert({
    customer_name: String(b.customer_name), phone: String(b.phone),
    address: String(b.address || ''), notes: String(b.notes || ''),
    items: items.map(({ stock, ...i }) => i),
    total: items.reduce((a, i) => a + i.price * i.qty, 0),
  })
  if (error) return Response.json({ error: 'Não foi possível guardar o pedido.' }, { status: 500 })
  for (const i of items) await sb.from('products').update({ stock: i.stock - i.qty }).eq('id', i.id)
  return Response.json({ ok: true })
}

export async function PATCH(req: Request) {
  if (!isAdmin(req)) return denied()
  const { id, status } = await req.json()
  const { data: o } = await sb.from('orders').select('*').eq('id', id).maybeSingle()
  if (!o) return Response.json({ error: 'Não encontrado' }, { status: 404 })
  if (status === 'cancelada' && o.status !== 'cancelada')   // devolve o stock
    for (const i of o.items) {
      const { data: p } = await sb.from('products').select('stock').eq('id', i.id).maybeSingle()
      if (p) await sb.from('products').update({ stock: p.stock + i.qty }).eq('id', i.id)
    }
  await sb.from('orders').update({ status }).eq('id', id)
  return Response.json({ ok: true })
}
