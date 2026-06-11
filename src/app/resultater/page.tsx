import { Award, Trophy, Medal } from 'lucide-react'

const resultater = [
  { year: '2019', title: 'DM Guld', dog: "Team Englund's Aqua", handler: 'Rita Andersen, PH Odder', type: 'gold' },
  { year: '2015', title: 'Udtaget til DM', dog: "Team Englund's Bessi", handler: 'Bente Andersen, PH Odder', type: 'silver' },
  { year: '2014', title: 'DM Guld', dog: "Team Englund's Cooper", handler: 'Niels Hansen, PH Odense', type: 'gold' },
  { year: '2012', title: 'DM Guld', dog: "Team Englund's Aqua", handler: 'Rita Andersen, PH Odder', type: 'gold' },
  { year: '2012', title: 'DM Sølv', dog: "Team Englund's Basse", handler: '', type: 'silver' },
]

function ResultIcon({ type }: { type: string }) {
  if (type === 'gold') return <Trophy className="w-6 h-6 text-yellow-500" />
  if (type === 'silver') return <Medal className="w-6 h-6 text-slate-400" />
  return <Award className="w-6 h-6 text-blue-400" />
}

export default function ResultaterPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-[#0c2340] mb-2">Resultater</h1>
      <p className="text-slate-600 mb-10">Vores hunde har opnået flotte resultater i konkurrencer og tjeneste.</p>

      <div className="space-y-4">
        {resultater.map((r, i) => (
          <div key={i} className="flex items-start gap-4 bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex-shrink-0 mt-0.5">
              <ResultIcon type={r.type} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">{r.year}</span>
                <h3 className="font-bold text-[#0c2340]">{r.title}</h3>
              </div>
              <p className="text-slate-700 font-medium">{r.dog}</p>
              {r.handler && <p className="text-sm text-slate-500">{r.handler}</p>}
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
