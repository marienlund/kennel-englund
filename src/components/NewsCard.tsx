import { News } from '@/lib/types'

export default function NewsCard({ item }: { item: News }) {
  const date = new Date(item.published_at).toLocaleDateString('da-DK', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
      <div className="p-6">
        <time className="text-xs font-medium text-blue-700 uppercase tracking-wide">
          {date}
        </time>
        <h3 className="font-bold text-lg text-slate-900 mt-1 mb-2">{item.title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
          {item.content}
        </p>
      </div>
    </article>
  )
}
