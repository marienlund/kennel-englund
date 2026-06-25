import DogCard from '@/components/DogCard'
import { getDogs } from '@/lib/data'
import { createClient } from '@supabase/supabase-js'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Avlstæver | Kennel Team Englund',
  description: 'Se alle vores avlstæver med sundhedsdata, mentalbeskrivelser og resultater.',
}

async function getFemales() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    const dogs = await getDogs()
    return dogs.filter((d) => d.gender === 'female')
  }
  try {
    const supabase = createClient(url, key)
    const { data } = await supabase
      .from('dogs')
      .select('*')
      .eq('gender', 'female')
      .order('sort_order', { ascending: true })
      .order('name', { ascending: true })
    if (data && data.length > 0) return data
  } catch {}
  const dogs = await getDogs()
  return dogs.filter((d) => d.gender === 'female')
}

export default async function AvlstaeverPage() {
  const females = await getFemales()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
        <span className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center text-lg">♀</span>
        Avlstæver
      </h1>
      <p className="text-slate-600 mb-10 max-w-2xl">
        Vores avlstæver er omhyggeligt udvalgt for mentalitet, sundhed og brugbarhed.
        Klik på en hund for at se detaljer.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {females.map((dog) => (
          <DogCard key={dog.id} dog={dog} />
        ))}
      </div>
    </div>
  )
}
