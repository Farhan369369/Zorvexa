'use client'
import { useState } from 'react'
import Link from 'next/link'
import { kz, WHATSAPP } from '@/lib/shop'
import { useCart } from '@/lib/cart'
import { Img } from '@/components/ProductCard'

export default function Cart() {
  const { items, total, setQty, clear } = useCart()
  const [f, setF] = useState({ customer_name: '', phone: '', address: '', notes: '' })
  const [err, setErr] = useState('')
  const [sent, setSent] = useState(false)
  const [wa, setWa] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr('')
    const r = await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...f, items: items.map(i => ({ id: i.id, qty: i.qty })) }) })
    if (!r.ok) { setErr((await r.json()).error || 'Não foi possível enviar o pedido.'); setBusy(false); return }
    const msg = `Olá! Fiz um pedido na ZORVEXA:\n${items.map(i => `• ${i.qty}x ${i.name} (${kz(i.price * i.qty)})`).join('\n')}\nTotal: ${kz(total)}\nNome: ${f.customer_name}\nTelefone: ${f.phone}`
    setWa(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`); clear(); setSent(true); setBusy(false)
  }

  if (sent) return <div className="py-16 text-center"><h1 className="font-display text-2xl font-bold">Pedido enviado!</h1><p className="mt-2">O seu pedido foi registado. Envie-nos também pelo WhatsApp para confirmarmos mais depressa.</p><div className="mt-6 flex flex-col items-center gap-3"><a href={wa} target="_blank" rel="noreferrer" className="btn btn-primary">Enviar pelo WhatsApp</a><Link href="/" className="btn btn-ghost">Voltar à loja</Link></div></div>
  if (!items.length) return <div className="py-16 text-center"><p>O carrinho está vazio.</p><Link href="/" className="btn btn-dark mt-4">Ver produtos</Link></div>

  return (
    <div className="mt-6 grid gap-8 md:grid-cols-2">
      <div>
        <h1 className="mb-4 font-display text-2xl font-bold">Carrinho</h1>
        <div className="space-y-3">{items.map(i => (
          <div key={i.id} className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-ink/10">
            <Img src={i.image_url} alt={i.name} className="h-16 w-16 rounded-lg" />
            <div className="flex-1"><p className="font-semibold">{i.name}</p><p className="text-sm">{kz(i.price)}</p></div>
            <div className="flex items-center gap-2">
              <button className="btn btn-ghost !px-3 !py-1" onClick={() => setQty(i.id, i.qty - 1)}>−</button>
              <span>{i.qty}</span>
              <button className="btn btn-ghost !px-3 !py-1" onClick={() => setQty(i.id, i.qty + 1)}>+</button>
            </div>
          </div>))}</div>
        <p className="mt-4 text-right font-display text-xl font-bold">Total: {kz(total)}</p>
      </div>
      <form onSubmit={submit} className="space-y-3">
        <h2 className="font-display text-2xl font-bold">Os seus dados</h2>
        <input required className="input" placeholder="Nome" value={f.customer_name} onChange={e => setF({ ...f, customer_name: e.target.value })} />
        <input required className="input" type="tel" placeholder="Telefone / WhatsApp" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} />
        <input className="input" placeholder="Morada de entrega" value={f.address} onChange={e => setF({ ...f, address: e.target.value })} />
        <textarea className="input" placeholder="Observações" value={f.notes} onChange={e => setF({ ...f, notes: e.target.value })} />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="btn btn-primary w-full" disabled={busy}>{busy ? 'A enviar…' : 'Enviar pedido'}</button>
      </form>
    </div>
  )
}
