'use client'
import { useEffect, useState } from 'react'
import { CATEGORIES, type Product } from '@/lib/shop'
import ProductCard from '@/components/ProductCard'

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(d => { setProducts(d); setLoading(false) })
  }, [])

  const list = products.filter(p =>
    (!cat || p.category === cat) && p.name.toLowerCase().includes(q.toLowerCase()))

  return (
    <>
      <section className="my-6 rounded-2xl bg-ink px-6 py-12 text-white sm:px-12 sm:py-16">
        <h1 className="font-display text-4xl font-extrabold leading-tight sm:text-6xl">Tecnologia que liga<br />o seu dia.</h1>
        <p className="mt-4 max-w-md text-white/70">Colunas, fones, teclados, carregadores e acessórios gaming. Escolha, encomende e receba.</p>
        <a href="#produtos" className="btn btn-primary mt-6">Ver produtos</a>
      </section>

      <section className="mb-8 grid gap-3 sm:grid-cols-3">
        {[['1', 'Escolha', 'Navegue pelos produtos e junte ao carrinho.'], ['2', 'Envie o pedido', 'Deixe o seu nome e telefone.'], ['3', 'Confirmamos', 'Falamos consigo pelo WhatsApp para combinar tudo.']].map(([n, t, d]) => (
          <div key={n} className="flex gap-3 rounded-xl bg-white p-4 ring-1 ring-ink/10">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-volt font-display font-bold text-white">{n}</span>
            <div><p className="font-semibold">{t}</p><p className="text-sm text-ink/60">{d}</p></div>
          </div>))}
      </section>

      <section id="produtos" className="scroll-mt-20">
        <input className="input" placeholder="Pesquisar produtos…" value={q} onChange={e => setQ(e.target.value)} />
        <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
          {['', ...CATEGORIES].map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold ${cat === c ? 'bg-volt text-white' : 'bg-white ring-1 ring-ink/15'}`}>
              {c || 'Todos'}
            </button>
          ))}
        </div>
        {loading ? <p className="py-10 text-center">A carregar…</p>
          : list.length === 0 ? <p className="py-10 text-center text-ink/60">{products.length === 0 ? 'Em breve teremos novos produtos.' : 'Nenhum produto encontrado. Tente outra pesquisa ou categoria.'}</p>
          : <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{list.map(p => <ProductCard key={p.id} p={p} />)}</div>}
      </section>
    </>
  )
}
