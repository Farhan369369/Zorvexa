import { WHATSAPP } from '@/lib/shop'

export default function WhatsAppButton() {
  if (!WHATSAPP) return null
  return (
    <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer" aria-label="Falar connosco no WhatsApp"
      className="fixed bottom-4 right-4 z-30 rounded-full bg-[#25D366] px-5 py-3 font-semibold text-white shadow-lg transition hover:brightness-95">
      WhatsApp
    </a>
  )
}
