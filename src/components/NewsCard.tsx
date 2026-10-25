import { News } from '@/lib/types'
import Link from 'next/link'

export default function NewsCard({ item }: { item: News }) {
  const date = new Date(item.published_at).toLocaleDateString('da-DK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden transition-shadow hover:shadow-lg">
      <Link
        href={`/nyheder/${item.id}`}
        className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
        aria-label={`Læs hele nyheden: ${item.title}`}
      >
      <div className="p-6">
        <time className="text-xs font-medium text-blue-700 uppercase tracking-wide">
          {date}
        </time>
        <h3 className="font-bold text-lg text-slate-900 mt-1 mb-2">{item.title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
          {item.content}
        </p>
        <span className="inline-block mt-4 text-sm font-semibold text-blue-700">
          Læs hele nyheden →
        </span>
      </div>
      </Link>
    </article>
  )
}
