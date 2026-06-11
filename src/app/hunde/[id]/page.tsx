import { getDog, getDogs } from '@/lib/data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Shield, Brain, GraduationCap, Trophy, Calendar, Users } from 'lucide-react'
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

function InfoSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="font-bold text-lg text-slate-900 mb-3 flex items-center gap-2">
        <Icon size={20} className="text-blue-700" />
        {title}
      </h2>
      {children}
    </div>
  )
}

function HealthRow({ label, value }: { label: string; value: string | null }) {
  if (!value) return null
  const isGood = value === 'HD-A' || value === 'AD 0/0' || value === 'Fri'
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-slate-600 text-sm">{label}</span>
      <span
        className={`font-semibold text-sm px-2.5 py-0.5 rounded-full ${
          isGood ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
        }`}
      >
        {value}
      </span>
    </div>
  )
}

export default async function DogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const dog = await getDog(id)
  if (!dog) notFound()

  const age = dog.birthdate ? calculateAge(dog.birthdate) : null

  const birthFormatted = dog.birthdate
    ? new Date(dog.birthdate).toLocaleDateString('da-DK', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <Link
        href="/hunde"
        className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-800 text-sm font-medium mb-6"
      >
        <ArrowLeft size={16} /> Tilbage til alle hunde
      </Link>

      {/* Hero area */}
      <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden mb-8">
        <div className="aspect-[16/7] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
          <span className="text-8xl opacity-50">{dog.gender === 'male' ? '🐕' : '🐕‍🦺'}</span>
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span
              className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                dog.gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
              }`}
            >
              {dog.gender === 'male' ? '♂ Han' : '♀ Tæve'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{dog.name}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500">
            {birthFormatted && (
              <span className="flex items-center gap-1">
                <Calendar size={14} /> Født {birthFormatted}{age !== null && ` (${age} år)`}
              </span>
            )}
            {(dog.sire_name || dog.dam_name) && (
              <span className="flex items-center gap-1">
                <Users size={14} />
                {dog.sire_name && <>Far: {dog.sire_name}</>}
                {dog.sire_name && dog.dam_name && ' · '}
                {dog.dam_name && <>Mor: {dog.dam_name}</>}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Health */}
        <InfoSection icon={Shield} title="Sundhed">
          <HealthRow label="Hofter (HD)" value={dog.hd_score} />
          <HealthRow label="Albuer (AD)" value={dog.ad_score} />
          <HealthRow label="OCD" value={dog.ocd_status} />
        </InfoSection>

        {/* Mental */}
        {dog.mental_description && (
          <InfoSection icon={Brain} title="Mentalbeskrivelse">
            <p className="text-slate-600 text-sm leading-relaxed">{dog.mental_description}</p>
          </InfoSection>
        )}

        {/* Training */}
        {dog.training_results && (
          <InfoSection icon={GraduationCap} title="Uddannelse & Resultater">
            <p className="text-slate-600 text-sm leading-relaxed">{dog.training_results}</p>
          </InfoSection>
        )}

        {/* Achievements */}
        {dog.achievements && (
          <InfoSection icon={Trophy} title="Præstationer">
            <p className="text-slate-600 text-sm leading-relaxed">{dog.achievements}</p>
          </InfoSection>
        )}
      </div>
    </div>
  )
}
