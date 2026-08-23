import { createServerSupabase } from '@/lib/supabase/server'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

const hardcodedResults = [
  { year: '2019', title: 'DM Guld', dog_name: "Team Englund's Aqua", handler: 'Rita Andersen, PH Odder', result_type: 'gold', description: '', image_url: '' },
  { year: '2015', title: 'Udtaget til DM', dog_name: "Team Englund's Bessi", handler: 'Bente Andersen, PH Odder', result_type: 'silver', description: '', image_url: '' },
  { year: '2014', title: 'DM Guld', dog_name: "Team Englund's Cooper", handler: 'Niels Hansen, PH Odense', result_type: 'gold', description: '', image_url: '' },
  { year: '2012', title: 'DM Guld', dog_name: "Team Englund's Aqua", handler: 'Rita Andersen, PH Odder', result_type: 'gold', description: '', image_url: '' },
  { year: '2012', title: 'DM Sølv', dog_name: "Team Englund's Basse", handler: '', result_type: 'silver', description: '', image_url: '' },
]

async function getResults() {
  try {
    const supabase = await createServerSupabase()
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .order('year', { ascending: false })
      .order('sort_order', { ascending: true })
    if (error) throw error
    if (data && data.length > 0) return data
    return hardcodedResults
  } catch {
    return hardcodedResults
  }
}

export default async function ResultaterPage() {
  const resultater = await getResults()

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-[#0c2340] mb-2">Resultater</h1>
      <p className="text-slate-600 mb-10">Vores hunde har opnået flotte resultater i konkurrencer og tjeneste.</p>

      <div className="space-y-4">
        {resultater.map((r: { id?: string; year: string; title: string; dog_name: string; handler: string; description?: string; image_url?: string }, i: number) => (
          <div key={r.id || i} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="flex items-stretch">
              {/* Left: Date */}
              <div className="bg-[#0c2340] text-white px-4 py-5 flex flex-col items-center justify-center min-w-[90px]">
                <span className="text-lg font-bold">{r.year}</span>
              </div>

              {/* Middle: Title, dog, handler, description */}
              <div className="flex-1 p-5">
                <h3 className="font-bold text-[#0c2340] text-lg">{r.title}</h3>
                <p className="text-slate-700 font-medium">{r.dog_name}</p>
                {r.handler && <p className="text-sm text-slate-500">{r.handler}</p>}
                {r.description && (
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">{r.description}</p>
                )}
              </div>

              {/* Right: Image if uploaded */}
              {r.image_url && (
                <div className="flex-shrink-0 w-32">
                  <img
                    src={r.image_url}
                    alt={r.title || 'Resultat billede'}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-[#0c2340] text-blue-50 rounded-xl p-6 sm:p-8">
        <h2 className="text-xl font-bold mb-3">Tjenestehunde</h2>
        <p className="text-blue-100/80 leading-relaxed">
          Flere af vores hunde er godkendt som tjenestehunde hos politiet. 
          Vi er stolte af at vores opdræt producerer hunde der både er fremragende familiehunde 
          og dygtige arbejdshunde.
        </p>
      </div>
    </main>
  )
}
