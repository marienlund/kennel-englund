import { getLitters } from '@/lib/data'
import { Baby, Phone, ExternalLink } from 'lucide-react'
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
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
        <Baby size={32} className="text-blue-700" />
        Hvalpe
      </h1>
      <p className="text-slate-600 mb-10 max-w-2xl">
        Vi planlægger vores kuld omhyggeligt med fokus på sundhed, mentalitet og brugbarhed.
      </p>

      {litters.length === 0 && (
        <p className="text-slate-500 text-center py-12">Ingen kuld at vise lige nu.</p>
      )}

      <div className="space-y-16">
        {litters.map((litter) => {
          const birthDate = litter.birth_date
            ? new Date(litter.birth_date).toLocaleDateString('da-DK', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : null

          return (
            <div key={litter.id} className="space-y-6">
              {/* Boks 1: Kuld info */}
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 sm:p-8">
                <h2 className="text-xl font-bold text-[#0c2340] mb-4">Kuld</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex gap-4">
                    <span className="text-slate-500 w-24 flex-shrink-0 font-medium">Hannen:</span>
                    <span className="text-slate-900 font-semibold">{litter.sire_name}</span>
                    {litter.sire_working_dog_url && (
                      <a href={litter.sire_working_dog_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#2563eb] hover:text-[#0c2340]">
                        Working Dog <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                  <div className="flex gap-4">
                    <span className="text-slate-500 w-24 flex-shrink-0 font-medium">Tæven:</span>
                    <span className="text-slate-900 font-semibold">{litter.dam_name}</span>
                    {litter.dam_working_dog_url && (
                      <a href={litter.dam_working_dog_url} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#2563eb] hover:text-[#0c2340]">
                        Working Dog <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                  {birthDate && (
                    <div className="flex gap-4">
                      <span className="text-slate-500 w-24 flex-shrink-0 font-medium">Født:</span>
                      <span className="text-slate-900">{birthDate}</span>
                    </div>
                  )}
                  <div className="flex gap-4">
                    <span className="text-slate-500 w-24 flex-shrink-0 font-medium">Hanner:</span>
                    <span className="text-slate-900">♂ {litter.males_count}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-slate-500 w-24 flex-shrink-0 font-medium">Tæver:</span>
                    <span className="text-slate-900">♀ {litter.females_count}</span>
                  </div>
                </div>
                {litter.description && (
                  <p className="text-slate-600 text-sm leading-relaxed mt-4 border-t border-slate-100 pt-4">{litter.description}</p>
                )}
              </div>

              {/* Boks 2: Hanner */}
              {litter.males && litter.males.length > 0 && (
                <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 sm:p-8">
                  <h2 className="text-lg font-bold text-[#0c2340] mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">♂</span>
                    Hanner
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {litter.males.map((puppy, i) => (
                      <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
                        {puppy.photo_url ? (
                          <div className="aspect-square bg-slate-100">
                            <img src={puppy.photo_url} alt={puppy.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="aspect-square bg-slate-50 flex flex-col items-center justify-center border-b border-slate-200">
                            <span className="text-4xl opacity-30 mb-2">📷</span>
                            <span className="text-xs text-slate-400">Foto kommer</span>
                          </div>
                        )}
                        <div className="p-3 space-y-1">
                          <p className="font-semibold text-slate-900 text-sm">{puppy.name}</p>
                          {puppy.working_dog_url && (
                            <a href={puppy.working_dog_url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-[#2563eb] hover:text-[#0c2340]">
                              Working Dog <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Boks 3: Tæver */}
              {litter.females && litter.females.length > 0 && (
                <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6 sm:p-8">
                  <h2 className="text-lg font-bold text-[#0c2340] mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-sm">♀</span>
                    Tæver
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {litter.females.map((puppy, i) => (
                      <div key={i} className="border border-slate-200 rounded-lg overflow-hidden">
                        {puppy.photo_url ? (
                          <div className="aspect-square bg-slate-100">
                            <img src={puppy.photo_url} alt={puppy.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="aspect-square bg-slate-50 flex flex-col items-center justify-center border-b border-slate-200">
                            <span className="text-4xl opacity-30 mb-2">📷</span>
                            <span className="text-xs text-slate-400">Foto kommer</span>
                          </div>
                        )}
                        <div className="p-3 space-y-1">
                          <p className="font-semibold text-slate-900 text-sm">{puppy.name}</p>
                          {puppy.working_dog_url && (
                            <a href={puppy.working_dog_url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-[#2563eb] hover:text-[#0c2340]">
                              Working Dog <ExternalLink size={10} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
