import './globals.css'
import { Sora, Manrope } from 'next/font/google'
import { CartProvider } from '@/lib/cart'
import Header from '@/components/Header'
import WhatsAppButton from '@/components/WhatsAppButton'

const sora = Sora({ subsets: ['latin'], variable: '--font-sora' })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope' })

export const metadata = { title: 'ZORVEXA | Eletrónicos', description: 'Colunas, fones, teclados, carregadores e muito mais.' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body className={`${sora.variable} ${manrope.variable}`}>
        <CartProvider>
          <Header />
          <main className="mx-auto max-w-6xl px-4 pb-20">{children}</main>
          <footer className="border-t border-ink/10 py-8 text-center text-sm text-ink/60">© ZORVEXA. Todos os direitos reservados.</footer>
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  )
}
