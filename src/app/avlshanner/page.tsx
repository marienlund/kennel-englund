import DogCard from '@/components/DogCard'
import { createClient } from '@supabase/supabase-js'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Avlshanner | Kennel Team Englund',
  description: 'Se alle vores avlshanner.',
}

export default async function AvlshannerPage() {
  let males: any[] = []

  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (url && key) {
      const supabase = createClient(url, key)
      const { data } = await supabase
        .from('dogs')
        .select('*')
        .eq('gender', 'male')
        .order('name')
      if (data) males = data
    }
  } catch (e) {
    console.error('Avlshanner error:', e)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
        <span className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-lg">♂</span>
        Avlshanner
      </h1>
      <p className="text-slate-600 mb-10 max-w-2xl">
        Vores avlshanner er udvalgt for deres stærke mentale egenskaber, sundhed og arbejdsevne.
      </p>

      {males.length === 0 ? (
        <p className="text-slate-500">Ingen avlshanner fundet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {males.map((dog) => (
            <DogCard key={dog.id} dog={dog} />
          ))}
        </div>
      )}
    </div>
  )
}
