export async function POST() {
  return new Response('{"ok":true}', { headers: { 'Set-Cookie': 'zx-admin=; Path=/; Max-Age=0' } })
}
