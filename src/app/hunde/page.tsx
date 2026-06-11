import DogCard from '@/components/DogCard'
import { getDogs } from '@/lib/data'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vores hunde | Kennel Team Englund',
  description: 'Se alle vores schæferhunde med sundhedsdata, mentalbeskrivelser og resultater.',
}

export default async function HundePage() {
  const dogs = await getDogs()
  const males = dogs.filter((d) => d.gender === 'male')
  const females = dogs.filter((d) => d.gender === 'female')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Vores hunde</h1>
      <p className="text-slate-600 mb-10 max-w-2xl">
        Alle vores avlshunde er røntgenfotograferet, mentalt beskrevne og uddannede. 
        Klik på en hund for at se detaljer.
      </p>

      {males.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">♂</span>
            Hanner
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {males.map((dog) => (
              <DogCard key={dog.id} dog={dog} />
            ))}
          </div>
        </section>
      )}

      {females.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-sm">♀</span>
            Tæver
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {females.map((dog) => (
              <DogCard key={dog.id} dog={dog} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
