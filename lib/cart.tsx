'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import type { Product } from './shop'

export type Item = { id: string; name: string; price: number; image_url: string; qty: number }
type Ctx = {
  items: Item[]; count: number; total: number
  add: (p: Product) => void; setQty: (id: string, q: number) => void; clear: () => void
}
const C = createContext<Ctx>(null as unknown as Ctx)
export const useCart = () => useContext(C)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Item[]>([])
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem('zx-cart') || '[]')) } catch {} }, [])
  useEffect(() => { try { localStorage.setItem('zx-cart', JSON.stringify(items)) } catch {} }, [items])
  const add = (p: Product) => setItems(s => s.some(i => i.id === p.id)
    ? s.map(i => i.id === p.id ? { ...i, qty: Math.min(i.qty + 1, p.stock) } : i)
    : [...s, { id: p.id, name: p.name, price: p.price, image_url: p.image_url, qty: 1 }])
  const setQty = (id: string, q: number) => setItems(s => q <= 0 ? s.filter(i => i.id !== id) : s.map(i => i.id === id ? { ...i, qty: q } : i))
  return <C.Provider value={{
    items, add, setQty, clear: () => setItems([]),
    count: items.reduce((a, i) => a + i.qty, 0),
    total: items.reduce((a, i) => a + i.qty * i.price, 0),
  }}>{children}</C.Provider>
}
