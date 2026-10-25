import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getNewsItem } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await getNewsItem(id)
  if (!item) notFound()

  const date = new Date(item.published_at).toLocaleDateString('da-DK', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      <Link href="/nyheder" className="inline-block text-sm font-semibold text-blue-700 hover:underline mb-8">
        ← Tilbage til nyheder
      </Link>
      <article className="bg-white rounded-xl shadow-md border border-slate-200 p-6 sm:p-10">
        <time dateTime={item.published_at} className="text-xs font-medium text-blue-700 uppercase tracking-wide">
          {date}
        </time>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#0c2340] mt-2 mb-8 break-words">
          {item.title}
        </h1>
        <div className="text-slate-700 leading-relaxed whitespace-pre-wrap break-words">
          {item.content}
        </div>
      </article>
    </main>
  )
}
