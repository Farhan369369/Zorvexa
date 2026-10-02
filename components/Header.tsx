'use client'
import Link from 'next/link'
import { useCart } from '@/lib/cart'

export default function Header() {
  const { count } = useCart()
  return (
    <header className="sticky top-0 z-20 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-display text-2xl font-extrabold tracking-tight">ZORVEXA<span className="text-signal">.</span></Link>
        <Link href="/carrinho" className="btn btn-dark">Carrinho ({count})</Link>
      </div>
    </header>
  )
}
