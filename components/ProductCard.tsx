'use client'
import { useState } from 'react'
import Link from 'next/link'
import { inStock, kz, type Product } from '@/lib/shop'
import { useCart } from '@/lib/cart'

export function Img({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return src
    ? <img src={src} alt={alt} loading="lazy" className={`object-cover ${className}`} />
    : <div className={`flex items-center justify-center bg-gradient-to-br from-ink/5 to-volt/10 font-display text-3xl font-extrabold text-ink/20 ${className}`}>Z</div>
}

export function Stock({ p }: { p: Product }) {
  if (!inStock(p)) return <span className="text-sm font-semibold text-red-600">Esgotado</span>
  return (
    <span className="text-sm font-semibold text-emerald-700">Disponível
      {p.stock <= 3 && <span className="ml-1 font-normal text-signal">· últimas {p.stock}</span>}
    </span>
  )
}

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useCart()
  const [added, setAdded] = useState(false)
  const ok = inStock(p)
  return (
    <div className="flex flex-col overflow-hidden rounded-xl bg-white ring-1 ring-ink/10 transition hover:shadow-lg">
      <Link href={`/produto/${p.id}`} className="relative block">
        <Img src={p.image_url} alt={p.name} className={`aspect-square w-full ${ok ? '' : 'opacity-50'}`} />
        {!ok && <span className="absolute left-2 top-2 rounded bg-ink px-2 py-1 text-xs font-bold text-white">ESGOTADO</span>}
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <span className="text-xs text-ink/50">{p.category}</span>
        <Link href={`/produto/${p.id}`} className="font-semibold leading-snug hover:text-volt">{p.name}</Link>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-2 pt-2">
          <span className="font-display text-lg font-bold">{kz(p.price)}</span><Stock p={p} />
        </div>
        <button className="btn btn-primary mt-2" disabled={!ok}
          onClick={() => { add(p); setAdded(true); setTimeout(() => setAdded(false), 1200) }}>
          {!ok ? 'Esgotado' : added ? 'Adicionado ✓' : 'Encomendar'}
        </button>
      </div>
    </div>
  )
}
