import { getDog, getDogs } from '@/lib/data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trophy, GraduationCap } from 'lucide-react'
import type { Metadata } from 'next'

function calculateAge(birthdate: string): number {
  const birth = new Date(birthdate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

export async function generateStaticParams() {
  const dogs = await getDogs()
  return dogs.map((dog) => ({ id: dog.id }))
}

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
            {/* Name and gender */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span
                  className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-lg font-bold ${
                    dog.gender === 'male'
                      ? 'bg-[#0c2340] text-blue-200'
                      : 'bg-pink-700 text-pink-200'
                  }`}
                >
                  {dog.gender === 'male' ? '♂' : '♀'}
                </span>
                <span
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    dog.gender === 'male' ? 'text-[#2563eb]' : 'text-pink-600'
                  }`}
                >
                  {dog.gender === 'male' ? 'Han' : 'Tæve'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#0c2340] leading-tight">
                {dog.name}
              </h1>
            </div>

            {/* Structured info table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full">
                <tbody className="divide-y divide-slate-100">
                  {birthFormatted && (
                    <tr>
                      <td className="px-5 py-3.5 text-sm font-semibold text-slate-500 w-36 bg-slate-50/50">
                        Født
                      </td>
                      <td className="px-5 py-3.5 text-sm text-[#0c2340] font-medium">
                        {birthFormatted}
                        {age !== null && (
                          <span className="text-slate-400 ml-1.5">({age} år)</span>
                        )}
                      </td>
                    </tr>
                  )}
                  {dog.sire_name && (
                    <tr>
                      <td className="px-5 py-3.5 text-sm font-semibold text-slate-500 w-36 bg-slate-50/50">
                        Far
                      </td>
                      <td className="px-5 py-3.5 text-sm text-[#0c2340] font-medium">
                        {dog.sire_name}
                      </td>
                    </tr>
                  )}
                  {dog.dam_name && (
                    <tr>
                      <td className="px-5 py-3.5 text-sm font-semibold text-slate-500 w-36 bg-slate-50/50">
                        Mor
                      </td>
                      <td className="px-5 py-3.5 text-sm text-[#0c2340] font-medium">
                        {dog.dam_name}
                      </td>
                    </tr>
                  )}
                  {healthItems.map((item) => (
                    <tr key={item.label}>
                      <td className="px-5 py-3.5 text-sm font-semibold text-slate-500 w-36 bg-slate-50/50">
                        {item.label}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block text-sm font-semibold px-2.5 py-0.5 rounded-full ${
                            item.value === 'HD-A' || item.value === 'AD 0/0' || item.value === 'Fri'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          {item.value}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mental description - expandable style */}
            {dog.mental_description && (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h2 className="text-sm font-bold uppercase tracking-wider text-[#0c2340] mb-2">
                  Mentalbeskrivelse
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {dog.mental_description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Full-width sections below */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Training */}
          {dog.training_results && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-bold text-[#0c2340] mb-3 flex items-center gap-2">
                <GraduationCap size={20} className="text-[#2563eb]" />
                Uddannelse & Resultater
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">{dog.training_results}</p>
            </div>
          )}

          {/* Achievements */}
          {dog.achievements && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
              <h2 className="font-bold text-[#0c2340] mb-3 flex items-center gap-2">
                <Trophy size={20} className="text-[#2563eb]" />
                Præstationer
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">{dog.achievements}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
