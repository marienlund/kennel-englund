import { createClient } from '@supabase/supabase-js'
import { getLitters } from '@/lib/data'
import { Phone, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'
import type { Litter, LitterExtraPhoto } from '@/lib/types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Hvalpe | Kennel Team Englund',
  description: 'Se aktuelle kuld af schæferhvalpe fra Kennel Team Englund.',
}

async function getSupabaseLitters(): Promise<Litter[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    return getLitters()
  }
  try {
    const supabase = createClient(url, key)
    const { data, error } = await supabase
      .from('litters')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })
    if (error) throw error
    if (data && data.length > 0) return data as Litter[]
  } catch {}
  return getLitters()
}

async function getExtraPhotos(litterIds: string[]): Promise<Record<string, LitterExtraPhoto[]>> {
  if (litterIds.length === 0) return {}
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return {}
  try {
    const supabase = createClient(url, key)
    const { data, error } = await supabase
      .from('litter_extra_photos')
      .select('*')
      .in('litter_id', litterIds)
      .order('sort_order', { ascending: true })
    if (error) throw error
    const grouped: Record<string, LitterExtraPhoto[]> = {}
    for (const photo of (data || []) as LitterExtraPhoto[]) {
      if (!grouped[photo.litter_id]) grouped[photo.litter_id] = []
      grouped[photo.litter_id].push(photo)
    }
    return grouped
  } catch {
    return {}
  }
}

function ExtraPhotoSlots({ photos, parentType }: { photos: LitterExtraPhoto[], parentType: 'sire' | 'dam' }) {
  const filtered = photos.filter(p => p.parent_type === parentType)
  return (
    <div className="grid grid-cols-4 gap-1 px-4 pb-2">
      {[0, 1, 2, 3].map((i) => {
        const photo = filtered[i]
        if (photo) {
          return (
            <a key={photo.id} href={photo.photo_url} target="_blank" rel="noopener noreferrer"
              className="aspect-square bg-slate-50 rounded border border-slate-200 overflow-hidden hover:opacity-90 transition-opacity">
              <img src={photo.photo_url} alt={`Ekstra foto ${i + 1}`} className="w-full h-full object-cover" />
            </a>
          )
        }
        return (
          <div key={`empty-${i}`} className="aspect-square bg-slate-50 rounded border border-dashed border-slate-300 flex items-center justify-center">
            <span className="text-lg opacity-20">📷</span>
          </div>
        )
      })}
    </div>
  )
}

export default async function HvalpePage() {
  const litters = await getSupabaseLitters()
  const extraPhotos = await getExtraPhotos(litters.map(l => l.id))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-10">Hvalpe</h1>

      {litters.length === 0 && (
        <p className="text-slate-500 text-center py-12">Ingen kuld at vise lige nu.</p>
      )}

      <div className="space-y-16">
        {litters.map((litter) => {
          const birthDate = litter.birth_date
            ? new Date(litter.birth_date).toLocaleDateString('da-DK', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              })
            : null

          const heading = litter.title || `${litter.sire_name} × ${litter.dam_name}`
          const litterPhotos = extraPhotos[litter.id] || []

          return (
            <div key={litter.id}>
              {/* 3-kolonne layout: Info | Far | Mor */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">

                {/* Kolonne 1: Kuld info */}
                <div className="bg-[#0c2340] text-white p-6 sm:p-8 flex flex-col justify-start">
                  <h2 className="text-xl font-bold mb-4">{heading}</h2>
                  {birthDate && (
                    <p className="text-blue-200 text-sm mb-1"><strong className="text-white">Fødselsdato:</strong> {birthDate}</p>
                  )}
                  <p className="text-blue-200 text-sm mb-4">
                    <strong className="text-white">Kuldstørrelse:</strong> {litter.males_count} hanner, {litter.females_count} tæver
                  </p>
                  {litter.description && (
                    <p className="text-blue-100/80 text-sm leading-relaxed mb-4">{litter.description}</p>
                  )}
                  <p className="text-blue-100/70 text-sm leading-relaxed">
                    Hvis du er interesseret i at vide mere om denne kombination eller reservere en hvalp, er du velkommen til at kontakte os.
                  </p>
                  <Link href="/kontakt" className="text-blue-300 hover:text-white text-sm mt-3 underline">
                    Kontakt os →
                  </Link>
                </div>

                {/* Kolonne 2: Far */}
                <div className="border-l border-slate-200">
                  <div className="relative">
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded z-10">Far</span>
                    {litter.sire_photo_url ? (
                      <div className="bg-slate-100 overflow-hidden rounded h-[350px]">
                        <img src={litter.sire_photo_url} alt={litter.sire_name} className="w-full h-full object-cover object-top" />
                      </div>
                    ) : (
                      <div className="aspect-[3/4] bg-slate-50 flex flex-col items-center justify-center">
                        <span className="text-5xl opacity-20 mb-2">📷</span>
                        <span className="text-xs text-slate-400">Foto</span>
                      </div>
                    )}
                  </div>
                  {/* Ekstra foto-felter */}
                  <ExtraPhotoSlots photos={litterPhotos} parentType="sire" />
                  <div className="p-4">
                    <p className="font-bold text-slate-900 text-lg mb-3">{litter.sire_name}</p>
                    <div className="space-y-1 text-sm mb-3">
                      {litter.sire_hd && <div className="flex gap-2"><span className="text-slate-500 font-medium">HD:</span><span className="text-slate-900">{litter.sire_hd}</span></div>}
                      {litter.sire_ad && <div className="flex gap-2"><span className="text-slate-500 font-medium">AD:</span><span className="text-slate-900">{litter.sire_ad}</span></div>}
                      {litter.sire_ocd && <div className="flex gap-2"><span className="text-slate-500 font-medium">OCD:</span><span className="text-slate-900">{litter.sire_ocd}</span></div>}
                      {litter.sire_training && <div className="flex gap-2"><span className="text-slate-500 font-medium">Uddannelse:</span><span className="text-slate-900">{litter.sire_training}</span></div>}
                    </div>
                    {litter.sire_working_dog_url ? (
                      <a href={litter.sire_working_dog_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#0c2340] text-white text-sm font-medium px-4 py-2 rounded hover:bg-[#1e3a5f] transition-colors w-full justify-center">
                        Se på Working Dog <ExternalLink size={14} />
                      </a>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Working Dog link mangler</p>
                    )}
                  </div>
                </div>

                {/* Kolonne 3: Mor */}
                <div className="border-l border-slate-200">
                  <div className="relative">
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded z-10">Mor</span>
                    {litter.dam_photo_url ? (
                      <div className="bg-slate-100 overflow-hidden rounded h-[350px]">
                        <img src={litter.dam_photo_url} alt={litter.dam_name} className="w-full h-full object-cover object-top" />
                      </div>
                    ) : (
                      <div className="aspect-[3/4] bg-slate-50 flex flex-col items-center justify-center">
                        <span className="text-5xl opacity-20 mb-2">📷</span>
                        <span className="text-xs text-slate-400">Foto</span>
                      </div>
                    )}
                  </div>
                  {/* Ekstra foto-felter */}
                  <ExtraPhotoSlots photos={litterPhotos} parentType="dam" />
                  <div className="p-4">
                    <p className="font-bold text-slate-900 text-lg mb-3">{litter.dam_name}</p>
                    <div className="space-y-1 text-sm mb-3">
                      {litter.dam_hd && <div className="flex gap-2"><span className="text-slate-500 font-medium">HD:</span><span className="text-slate-900">{litter.dam_hd}</span></div>}
                      {litter.dam_ad && <div className="flex gap-2"><span className="text-slate-500 font-medium">AD:</span><span className="text-slate-900">{litter.dam_ad}</span></div>}
                      {litter.dam_ocd && <div className="flex gap-2"><span className="text-slate-500 font-medium">OCD:</span><span className="text-slate-900">{litter.dam_ocd}</span></div>}
                      {litter.dam_training && <div className="flex gap-2"><span className="text-slate-500 font-medium">Uddannelse:</span><span className="text-slate-900">{litter.dam_training}</span></div>}
                    </div>
                    {litter.dam_working_dog_url ? (
                      <a href={litter.dam_working_dog_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#0c2340] text-white text-sm font-medium px-4 py-2 rounded hover:bg-[#1e3a5f] transition-colors w-full justify-center">
                        Se på Working Dog <ExternalLink size={14} />
                      </a>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Working Dog link mangler</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Kontakt */}
      <section className="bg-blue-50 rounded-2xl border border-blue-200 p-6 sm:p-8 mt-12">
        <h2 className="text-xl font-bold text-[#0c2340] mb-3">Interesseret?</h2>
        <p className="text-[#1e3a5f] text-sm leading-relaxed mb-4">
          Kontakt os for at høre mere om aktuelle og kommende kuld.
        </p>
        <Link
          href="/kontakt"
          className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-2.5 rounded-lg transition-colors text-sm"
        >
          <Phone size={16} /> Kontakt os
        </Link>
      </section>
    </div>
  )
}
