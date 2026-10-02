'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { inStock, kz, WHATSAPP, type Product } from '@/lib/shop'
import { useCart } from '@/lib/cart'
import { Img, Stock } from '@/components/ProductCard'

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { add } = useCart()
  const [p, setP] = useState<Product | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    fetch('/api/products/' + id).then(r => r.ok ? r.json() : null).then(d => { setP(d); setDone(true) })
  }, [id])

  if (!done) return <p className="py-10">A carregar…</p>
  if (!p) return <p className="py-10">Produto não encontrado.</p>
  const wa = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Olá! Tenho interesse em: ${p.name} (${kz(p.price)})`)}`

  return (
    <div className="mt-6 grid gap-8 md:grid-cols-2">
      <Img src={p.image_url} alt={p.name} className="aspect-square w-full rounded-2xl" />
      <div className="flex flex-col gap-3">
        <span className="text-sm text-ink/50">{p.category}</span>
        <h1 className="font-display text-3xl font-bold">{p.name}</h1>
        <p className="font-display text-3xl font-extrabold text-volt">{kz(p.price)}</p>
        <Stock p={p} />
        <p className="whitespace-pre-line text-ink/80">{p.description}</p>
        <div className="mt-2 flex flex-wrap gap-3">
          <button className="btn btn-primary" disabled={!inStock(p)} onClick={() => { add(p); router.push('/carrinho') }}>Encomendar</button>
          <a className="btn btn-ghost" href={wa} target="_blank" rel="noreferrer">Perguntar no WhatsApp</a>
        </div>
      </div>
    </div>
  )
}
