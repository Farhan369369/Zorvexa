import { token } from '@/lib/db'
export async function POST(req: Request) {
  const { password } = await req.json()
  if (!process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD)
    return Response.json({ error: 'Palavra-passe incorreta' }, { status: 401 })
  return new Response('{"ok":true}', { headers: {
    'Content-Type': 'application/json',
    'Set-Cookie': `zx-admin=${token()}; Path=/; HttpOnly; SameSite=Lax; Max-Age=2592000`,
  } })
}
