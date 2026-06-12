import Link from 'next/link'
import { Dog } from '@/lib/types'
import { Shield, Award } from 'lucide-react'

function calculateAge(birthdate: string): number {
  const birth = new Date(birthdate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

function HealthBadge({ label, value }: { label: string; value: string | null }) {
  if (!value) return null
  const isGood = value === 'HD-A' || value === 'AD 0/0' || value === 'Fri'
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
        isGood
          ? 'bg-blue-100 text-blue-800'
          : 'bg-slate-100 text-slate-700'
      }`}
    >
      <Shield size={12} />
      {label}: {value}
    </span>
  )
}

export default function DogCard({ dog }: { dog: Dog }) {
  const age = dog.birthdate ? calculateAge(dog.birthdate) : null

  return (
    <Link href={`/hunde/${dog.id}`} className="group block">
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-slate-200">
        {/* Photo */}
        <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-blue-100 overflow-hidden">
          {dog.photo_url ? (
            <img
              src={dog.photo_url}
              alt={dog.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl opacity-60 group-hover:scale-110 transition-transform">
                {dog.gender === 'male' ? '🐕' : '🐕‍🦺'}
              </span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-tight">
              {dog.name}
            </h3>
            {dog.achievements && (
              <Award size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
            )}
          </div>
          <p className="text-sm text-slate-500 mb-3">
            {dog.gender === 'male' ? 'Han' : 'Tæve'}
            {age !== null && ` · ${age} år`}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <HealthBadge label="HD" value={dog.hd_score} />
            <HealthBadge label="AD" value={dog.ad_score} />
            <HealthBadge label="OCD" value={dog.ocd_status} />
          </div>
        </div>
      </div>
    </Link>
  )
}
