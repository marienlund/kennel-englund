import { getLitters } from '@/lib/data'
import { Baby, CheckCircle, Clock, Phone } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hvalpe | Kennel Team Englund',
  description: 'Se aktuelle og kommende kuld af schæferhvalpe fra Kennel Team Englund.',
}

export default async function HvalpePage() {
  const litters = await getLitters()
  const current = litters.filter((l) => l.birth_date)
  const planned = litters.filter((l) => !l.birth_date)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Hvalpe</h1>
      <p className="text-slate-600 mb-10 max-w-2xl">
        Vi planlægger vores kuld omhyggeligt med fokus på sundhed, mentalitet og brugbarhed. 
        Alle hvalpe leveres med stamtavle, sundhedsattest og er chippet.
      </p>

      {/* Current litters */}
      {current.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Baby size={22} className="text-blue-700" />
            Aktuelle kuld
          </h2>
          <div className="space-y-6">
            {current.map((litter) => {
              const birthDate = litter.birth_date
                ? new Date(litter.birth_date).toLocaleDateString('da-DK', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : null
              return (
                <div
                  key={litter.id}
                  className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden"
                >
                  <div className="aspect-[16/5] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
                    <span className="text-6xl opacity-50">🐾</span>
                  </div>
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      {litter.available ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                          <CheckCircle size={14} /> Ledige hvalpe
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                          Alle reserveret
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      {litter.sire_name} × {litter.dam_name}
                    </h3>
                    {birthDate && (
                      <p className="text-sm text-slate-500 mb-3">Født {birthDate}</p>
                    )}
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-4">
                      <span>♂ {litter.males_count} hanner</span>
                      <span>♀ {litter.females_count} tæver</span>
                      <span>Totalt: {litter.males_count + litter.females_count} hvalpe</span>
                    </div>
                    {litter.description && (
                      <p className="text-slate-600 text-sm leading-relaxed">{litter.description}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Planned */}
      {planned.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Clock size={22} className="text-blue-500" />
            Planlagte kuld
          </h2>
          <div className="space-y-6">
            {planned.map((litter) => (
              <div
                key={litter.id}
                className="bg-white rounded-xl shadow-md border border-slate-200 p-6 sm:p-8"
              >
                <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 mb-3">
                  <Clock size={14} /> Planlagt
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {litter.sire_name} × {litter.dam_name}
                </h3>
                {litter.description && (
                  <p className="text-slate-600 text-sm leading-relaxed">{litter.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Waiting list */}
      <section className="bg-blue-50 rounded-2xl border border-blue-200 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-[#0c2340] mb-3">Venteliste</h2>
        <p className="text-[#1e3a5f] text-sm leading-relaxed mb-4">
          Er du interesseret i en hvalp fra Kennel Team Englund? Vi har en venteliste, og du er 
          velkommen til at kontakte os for at høre mere om vores planer og forventninger til nye 
          hvalpekøbere. Vi lægger stor vægt på at matche den rigtige hvalp med den rigtige familie.
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
