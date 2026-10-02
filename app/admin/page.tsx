'use client'
import { useEffect, useState } from 'react'
import { CATEGORIES, kz, type Product } from '@/lib/shop'
import { Img } from '@/components/ProductCard'

const STATUS = ['pendente', 'confirmada', 'enviada', 'entregue', 'cancelada']
const EMPTY = { name: '', description: '', price: 0, category: CATEGORIES[0], image_url: '', stock: 0, available: true }
const J = { 'Content-Type': 'application/json' }

export default function Admin() {
  const [ok, setOk] = useState<boolean | null>(null)
  const [pw, setPw] = useState('')
  const [err, setErr] = useState('')
  const [tab, setTab] = useState<'p' | 'o'>('p')
  const [prods, setProds] = useState<Product[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [f, setF] = useState<any>(EMPTY)

  async function load() {
    const r = await fetch('/api/orders')
    if (!r.ok) return setOk(false)
    setOrders(await r.json()); setProds(await (await fetch('/api/products')).json()); setOk(true)
  }
  useEffect(() => { load() }, [])

  async function login(e: React.FormEvent) {
    e.preventDefault(); setErr('')
    const r = await fetch('/api/login', { method: 'POST', headers: J, body: JSON.stringify({ password: pw }) })
    r.ok ? load() : setErr('Palavra-passe incorreta.')
  }
  async function save(e: React.FormEvent) {
    e.preventDefault()
    const r = await fetch(f.id ? `/api/products/${f.id}` : '/api/products', { method: f.id ? 'PUT' : 'POST', headers: J, body: JSON.stringify(f) })
    if (!r.ok) return alert('Erro ao guardar.')
    setF(EMPTY); load()
  }
  // Reduz a foto (fica leve no telemóvel) e envia para o armazenamento online
  function upload(file?: File) {
    if (!file) return
    const img = new Image()
    img.onload = () => {
      const s = Math.min(1, 900 / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = img.width * s; c.height = img.height * s
      c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
      c.toBlob(async blob => {
        const fd = new FormData(); fd.append('file', blob!, 'foto.jpg')
        const r = await fetch('/api/upload', { method: 'POST', body: fd })
        if (!r.ok) return alert('Erro ao enviar a foto.')
        const { url } = await r.json()
        setF((x: any) => ({ ...x, image_url: url }))
      }, 'image/jpeg', 0.8)
    }
    img.src = URL.createObjectURL(file)
  }
  async function del(id: string) {
    if (confirm('Eliminar este produto?')) { await fetch(`/api/products/${id}`, { method: 'DELETE' }); load() }
  }
  async function setStatus(id: string, status: string) {
    await fetch('/api/orders', { method: 'PATCH', headers: J, body: JSON.stringify({ id, status }) }); load()
  }

  if (ok === null) return <p className="py-10">A carregar…</p>
  if (!ok) return (
    <form onSubmit={login} className="mx-auto mt-16 max-w-sm space-y-3">
      <h1 className="font-display text-2xl font-bold">Administração</h1>
      <input required type="password" className="input" placeholder="Palavra-passe" value={pw} onChange={e => setPw(e.target.value)} />
      {err && <p className="text-sm text-red-600">{err}</p>}
      <button className="btn btn-dark w-full">Entrar</button>
    </form>
  )

  return (
    <div className="mt-6">
      <div className="mb-4 flex items-center gap-2">
        <button className={`btn ${tab === 'p' ? 'btn-dark' : 'btn-ghost'}`} onClick={() => setTab('p')}>Produtos</button>
        <button className={`btn ${tab === 'o' ? 'btn-dark' : 'btn-ghost'}`} onClick={() => setTab('o')}>Pedidos ({orders.filter(o => o.status === 'pendente').length})</button>
        <button className="btn btn-ghost ml-auto" onClick={async () => { await fetch('/api/logout', { method: 'POST' }); setOk(false) }}>Sair</button>
      </div>

      {tab === 'p' ? (
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <form onSubmit={save} className="space-y-2 rounded-xl bg-white p-4 ring-1 ring-ink/10 lg:sticky lg:top-20 lg:self-start">
            <h2 className="font-display text-lg font-bold">{f.id ? 'Editar produto' : 'Novo produto'}</h2>
            <input required className="input" placeholder="Nome" value={f.name} onChange={e => setF({ ...f, name: e.target.value })} />
            <textarea className="input" placeholder="Descrição" value={f.description} onChange={e => setF({ ...f, description: e.target.value })} />
            <div className="grid grid-cols-2 gap-2">
              <input required type="number" min={0} className="input" placeholder="Preço (Kz)" value={f.price} onChange={e => setF({ ...f, price: e.target.value })} />
              <input required type="number" min={0} className="input" placeholder="Stock" value={f.stock} onChange={e => setF({ ...f, stock: e.target.value })} />
            </div>
            <select className="input" value={f.category} onChange={e => setF({ ...f, category: e.target.value })}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
            {f.image_url && <Img src={f.image_url} alt="" className="h-24 w-24 rounded-lg" />}
            <input type="file" accept="image/*" onChange={e => upload(e.target.files?.[0])} />
            <label className="flex items-center gap-2"><input type="checkbox" checked={f.available} onChange={e => setF({ ...f, available: e.target.checked })} /> Disponível para venda</label>
            <div className="flex gap-2">
              <button className="btn btn-primary flex-1">Guardar</button>
              {f.id && <button type="button" className="btn btn-ghost" onClick={() => setF(EMPTY)}>Cancelar</button>}
            </div>
          </form>
          <div className="space-y-2">{prods.map(p => (
            <div key={p.id} className="flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-ink/10">
              <Img src={p.image_url} alt="" className="h-14 w-14 rounded-lg" />
              <div className="flex-1"><p className="font-semibold">{p.name}</p><p className="text-sm text-ink/60">{kz(p.price)} · stock {p.stock} · {p.available && p.stock > 0 ? 'Disponível' : 'Esgotado'}</p></div>
              <button className="btn btn-ghost !py-1" onClick={() => { setF(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Editar</button>
              <button className="btn btn-ghost !py-1 text-red-600" onClick={() => del(p.id)}>Eliminar</button>
            </div>))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">{orders.length === 0 && <p>Ainda não há pedidos.</p>}{orders.map(o => (
          <div key={o.id} className="rounded-xl bg-white p-4 ring-1 ring-ink/10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">{o.customer_name} · <a className="text-volt" href={`https://wa.me/${o.phone.replace(/\D/g, '')}`}>{o.phone}</a></p>
              <select className="input !w-auto" value={o.status} onChange={e => setStatus(o.id, e.target.value)}>{STATUS.map(s => <option key={s}>{s}</option>)}</select>
            </div>
            <ul className="mt-2 text-sm">{o.items.map((i: any) => <li key={i.id}>{i.qty}x {i.name}</li>)}</ul>
            <p className="mt-1 text-sm text-ink/60">{o.address} {o.notes && `· ${o.notes}`}</p>
            <p className="mt-1 font-bold">{kz(o.total)} <span className="font-normal text-ink/50">· {new Date(o.created_at).toLocaleString('pt-PT')}</span></p>
          </div>))}
        </div>
      )}
    </div>
  )
}
