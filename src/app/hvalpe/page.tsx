import { getLitters } from '@/lib/data'
import { Phone, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hvalpe | Kennel Team Englund',
  description: 'Se aktuelle kuld af schæferhvalpe fra Kennel Team Englund.',
}

export default async function HvalpePage() {
  const litters = await getLitters()

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

          return (
            <div key={litter.id}>
              {/* 3-kolonne layout: Info | Far | Mor */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">

                {/* Kolonne 1: Kuld info */}
                <div className="bg-[#0c2340] text-white p-6 sm:p-8 flex flex-col justify-center">
                  <h2 className="text-xl font-bold mb-4">{litter.sire_name} × {litter.dam_name}</h2>
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
                    {litter.males && litter.males[0]?.photo_url ? (
                      <div className="aspect-[3/4] bg-slate-100">
                        <img src={litter.males[0].photo_url} alt={litter.males[0]?.name || 'Far'} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="aspect-[3/4] bg-slate-50 flex flex-col items-center justify-center">
                        <span className="text-5xl opacity-20 mb-2">📷</span>
                        <span className="text-xs text-slate-400">Foto</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-slate-900 text-lg">{litter.males && litter.males[0]?.name || litter.sire_name}</p>
                    {litter.males && litter.males[0]?.working_dog_url ? (
                      <a href={litter.males[0].working_dog_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#0c2340] text-white text-sm font-medium px-4 py-2 rounded mt-3 hover:bg-[#1e3a5f] transition-colors w-full justify-center">
                        Se på Workingdog <ExternalLink size={14} />
                      </a>
                    ) : litter.sire_working_dog_url ? (
                      <a href={litter.sire_working_dog_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#0c2340] text-white text-sm font-medium px-4 py-2 rounded mt-3 hover:bg-[#1e3a5f] transition-colors w-full justify-center">
                        Se på Workingdog <ExternalLink size={14} />
                      </a>
                    ) : (
                      <p className="text-xs text-slate-400 italic mt-2">Working Dog link mangler</p>
                    )}
                  </div>
                </div>

                {/* Kolonne 3: Mor */}
                <div className="border-l border-slate-200">
                  <div className="relative">
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded z-10">Mor</span>
                    {litter.females && litter.females[0]?.photo_url ? (
                      <div className="aspect-[3/4] bg-slate-100">
                        <img src={litter.females[0].photo_url} alt={litter.females[0]?.name || 'Mor'} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="aspect-[3/4] bg-slate-50 flex flex-col items-center justify-center">
                        <span className="text-5xl opacity-20 mb-2">📷</span>
                        <span className="text-xs text-slate-400">Foto</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-slate-900 text-lg">{litter.females && litter.females[0]?.name || litter.dam_name}</p>
                    {litter.females && litter.females[0]?.working_dog_url ? (
                      <a href={litter.females[0].working_dog_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#0c2340] text-white text-sm font-medium px-4 py-2 rounded mt-3 hover:bg-[#1e3a5f] transition-colors w-full justify-center">
                        Se på Workingdog <ExternalLink size={14} />
                      </a>
                    ) : litter.dam_working_dog_url ? (
                      <a href={litter.dam_working_dog_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#0c2340] text-white text-sm font-medium px-4 py-2 rounded mt-3 hover:bg-[#1e3a5f] transition-colors w-full justify-center">
                        Se på Workingdog <ExternalLink size={14} />
                      </a>
                    ) : (
                      <p className="text-xs text-slate-400 italic mt-2">Working Dog link mangler</p>
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
