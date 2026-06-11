import NewsCard from '@/components/NewsCard'
import { getLatestNews } from '@/lib/data'

export default async function NyhederPage() {
  const news = await getLatestNews(20)

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-[#0c2340] mb-2">Nyheder</h1>
      <p className="text-slate-600 mb-10">Seneste nyt fra Kennel Team Englund.</p>

      {news.length > 0 ? (
        <div className="space-y-6">
          {news.map((item) => (
            <NewsCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400">
          <p className="text-lg">Ingen nyheder endnu.</p>
        </div>
      )}
    </main>
  )
}
