import Link from 'next/link'
import DogCard from '@/components/DogCard'
import NewsCard from '@/components/NewsCard'
import { getFeaturedDogs, getLatestNews } from '@/lib/data'
import { ArrowRight, Heart, Shield, Award } from 'lucide-react'
import { createServerSupabase } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// Default values (fallback if Supabase not available)
const DEFAULTS = {
  hero_image_url: '',
  hero_title: 'Kennel Team Englund',
  hero_subtitle: 'Schæferhundeopdræt siden 1984',
  intro_text_1: 'Opdræt af schæferhunde med fokus på mentalitet, sundhed og brugbarhed — siden 1984.',
  intro_text_2: 'Vi avler sunde, mentalt stærke og brugbare schæferhunde. Alle vores hunde er røntgenfotograferet, mentalt beskrevne og uddannede. Vi tror på, at en god schæferhund starter med et godt gemyt.',
}

async function getSiteSettings() {
  try {
    const supabase = await createServerSupabase()
    const { data, error } = await supabase.from('site_settings').select('id, value')
    if (error) throw error

    const settings = { ...DEFAULTS }
    for (const row of data || []) {
      if (row.id in settings) {
        settings[row.id as keyof typeof settings] = row.value
      }
    }
    return settings
  } catch {
    return DEFAULTS
  }
}

export default async function HomePage() {
  const [featuredDogs, latestNews, settings] = await Promise.all([
    getFeaturedDogs(),
    getLatestNews(3),
    getSiteSettings(),
  ])

  const heroImage = settings.hero_image_url || '/hero.jpg'

  return (
    <>
      {/* Hero */}
      <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
        <img
          src={heroImage}
          alt={`${settings.hero_title} - Tysk mester`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c2340]/80 via-[#0c2340]/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-lg">
            {settings.hero_title}
          </h1>
          <p className="mt-4 text-lg sm:text-xl text-blue-100/90 font-medium drop-shadow">
            {settings.hero_subtitle}
          </p>
        </div>
      </div>

      {/* Intro */}
      <section className="relative bg-gradient-to-br from-[#0c2340] via-[#1e3a5f] to-[#0c2340] text-blue-50 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg sm:text-xl text-blue-100/80 leading-relaxed mb-4">
              {settings.intro_text_1}
            </p>
            <p className="text-base text-blue-100/60 leading-relaxed mb-8">
              {settings.intro_text_2}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/hunde"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Se vores hunde <ArrowRight size={18} />
              </Link>
              <Link
                href="/hvalpe"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-blue-50 font-semibold px-6 py-3 rounded-lg transition-colors border border-white/20"
              >
                Aktuelle hvalpe
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="text-blue-700" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Mentalitet først</h3>
              <p className="text-slate-600 text-sm">
                Vi prioriterer et stærkt nervesystem, selvsikkerhed og god kontakt. 
                Alle hunde er mentalt beskrevne.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="text-blue-700" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Sundhed i fokus</h3>
              <p className="text-slate-600 text-sm">
                Alle avlsdyr er HD/AD-røntgenfotograferet og OCD-undersøgt. 
                Vi avler kun på sunde, kårede hunde.
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="text-blue-700" size={24} />
              </div>
              <h3 className="font-bold text-lg mb-2">Resultater</h3>
              <p className="text-slate-600 text-sm">
                Vores hunde præsterer på højt niveau i både udstilling og brugsprøver — 
                fra klubskuer til Bundessieger.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured dogs */}
      {featuredDogs.length > 0 && (
        <section className="py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Vores hunde</h2>
              <Link
                href="/hunde"
                className="text-blue-700 hover:text-blue-800 font-medium text-sm flex items-center gap-1"
              >
                Se alle <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDogs.map((dog) => (
                <DogCard key={dog.id} dog={dog} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest news */}
      {latestNews.length > 0 && (
        <section className="py-16 lg:py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">Seneste nyt</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestNews.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
