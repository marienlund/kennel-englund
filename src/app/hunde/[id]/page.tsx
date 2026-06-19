import { getDog, getDogs } from '@/lib/data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trophy, GraduationCap } from 'lucide-react'
import ExtraInfoBox from '@/components/ExtraInfoBox'
import type { Metadata } from 'next'

function calculateAge(birthdate: string): number {
  const birth = new Date(birthdate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

// Force dynamic rendering to avoid cookies() error at build time
export const dynamic = 'force-dynamic'
export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const dog = await getDog(id)
  if (!dog) return { title: 'Hund ikke fundet' }
  return {
    title: `${dog.name} | Kennel Team Englund`,
    description: dog.mental_description || `${dog.name} - schæferhund fra Kennel Team Englund`,
  }
}

export default async function DogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const dog = await getDog(id)
  if (!dog) notFound()

  const age = dog.birthdate ? calculateAge(dog.birthdate) : null

  const birthFormatted = dog.birthdate
    ? new Date(dog.birthdate).toLocaleDateString('da-DK', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  const healthItems = [
    { label: 'HD', value: dog.hd_score },
    { label: 'AD', value: dog.ad_score },
    { label: 'OCD', value: dog.ocd_status },
  ].filter((item) => item.value)

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Back button */}
        <Link
          href="/hunde"
          className="inline-flex items-center gap-2 text-[#0c2340] hover:text-[#2563eb] text-sm font-medium mb-8 group transition-colors"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Tilbage til alle hunde
        </Link>

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT: Photo area */}
          <div className="space-y-4">
            {/* Main photo */}
            <div className="aspect-[4/3] bg-gradient-to-br from-[#0c2340]/5 to-[#1e3a5f]/10 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              {dog.photo_url ? (
                <img
                  src={dog.photo_url}
                  alt={dog.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-8xl block mb-3 opacity-40">
                      {dog.gender === 'male' ? '🐕' : '🐕‍🦺'}
                    </span>
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Foto kommer snart</span>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail gallery placeholder */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center"
                >
                  <span className="text-slate-300 text-xs">📷</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Dog info */}
          <div className="space-y-6">
            {/* Name */}
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0c2340] leading-tight">
              {dog.name}
            </h1>

            {/* Simple table layout */}
            <div className="space-y-3 text-sm">
              {birthFormatted && (
                <div className="flex gap-4">
                  <span className="text-slate-500 w-28 flex-shrink-0 font-medium">Født d.</span>
                  <span className="text-slate-900">{birthFormatted}{age !== null ? ` (${age} år)` : ''}</span>
                </div>
              )}
              {dog.sire_name && (
                <div className="flex gap-4">
                  <span className="text-slate-500 w-28 flex-shrink-0 font-medium">Far:</span>
                  <span className="text-slate-900">{dog.sire_name}</span>
                </div>
              )}
              {dog.dam_name && (
                <div className="flex gap-4">
                  <span className="text-slate-500 w-28 flex-shrink-0 font-medium">Mor:</span>
                  <span className="text-slate-900">{dog.dam_name}</span>
                </div>
              )}
              {dog.hd_score && (
                <div className="flex gap-4">
                  <span className="text-slate-500 w-28 flex-shrink-0 font-medium">HD:</span>
                  <span className="text-slate-900">{dog.hd_score}</span>
                </div>
              )}
              {dog.ad_score && (
                <div className="flex gap-4">
                  <span className="text-slate-500 w-28 flex-shrink-0 font-medium">AD:</span>
                  <span className="text-slate-900">{dog.ad_score}</span>
                </div>
              )}
              {dog.ocd_status && (
                <div className="flex gap-4">
                  <span className="text-slate-500 w-28 flex-shrink-0 font-medium">OCD:</span>
                  <span className="text-slate-900">{dog.ocd_status}</span>
                </div>
              )}
              {dog.training_results && (
                <div className="flex gap-4">
                  <span className="text-slate-500 w-28 flex-shrink-0 font-medium">Uddannelse:</span>
                  <span className="text-slate-900">{dog.training_results}</span>
                </div>
              )}
              {dog.working_dog_url && (
                <div className="flex gap-4">
                  <span className="text-slate-500 w-28 flex-shrink-0 font-medium">Link til WD:</span>
                  <a
                    href={dog.working_dog_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2563eb] hover:text-[#0c2340] underline transition-colors"
                  >
                    Se på Working Dog ↗
                  </a>
                </div>
              )}
            </div>

            {/* Mental description */}
            {dog.mental_description && (
              <div className="border-t border-slate-200 pt-4">
                <h2 className="text-sm font-bold text-[#0c2340] mb-2">Mentalbeskrivelse</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{dog.mental_description}</p>
              </div>
            )}

            {/* Achievements */}
            {dog.achievements && (
              <div className="border-t border-slate-200 pt-4">
                <h2 className="text-sm font-bold text-[#0c2340] mb-2">Præstationer</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{dog.achievements}</p>
              </div>
            )}

            {/* Øvrige oplysninger - expandable */}
            {dog.extra_info && <ExtraInfoBox text={dog.extra_info} />}
          </div>
        </div>
      </div>
    </div>
  )
}
