import Link from 'next/link'

export default function NewsNotFound() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-[#0c2340] mb-4">Nyheden blev ikke fundet</h1>
      <p className="text-slate-600 mb-6">Nyheden kan være blevet slettet.</p>
      <Link href="/nyheder" className="font-semibold text-blue-700 hover:underline">← Tilbage til nyheder</Link>
    </main>
  )
}
