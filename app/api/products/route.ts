import { sb, isAdmin, denied, clean } from '@/lib/db'
export const dynamic = 'force-dynamic'

export async function GET() {
  const { data } = await sb.from('products').select('*').order('created_at', { ascending: false })
  return Response.json(data || [])
}
export async function POST(req: Request) {
  if (!isAdmin(req)) return denied()
  const { data, error } = await sb.from('products').insert(clean(await req.json())).select().single()
  return error ? Response.json({ error: error.message }, { status: 500 }) : Response.json(data)
}
