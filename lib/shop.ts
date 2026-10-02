export type Product = {
  id: string; name: string; description: string; price: number
  category: string; image_url: string; stock: number; available: boolean
}
export const CATEGORIES = [
  'Colunas Bluetooth', 'Fones e Headsets', 'Teclados', 'Ratos', 'Pen Drives',
  'Cartões de Memória', 'Cabos', 'Carregadores', 'Lâmpadas LED',
  'Extensões e Adaptadores', 'Gaming', 'Outros',
]
export const kz = (n: number) => `${Number(n).toLocaleString('pt-PT')} Kz`
export const inStock = (p: Product) => p.available && p.stock > 0
export const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || ''
