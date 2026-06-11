'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Dog } from '@/lib/types'
import { mockDogs } from '@/lib/mock-data'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Shield } from 'lucide-react'

export default function AdminHundePage() {
  const [dogs, setDogs] = useState<Dog[]>([])
  const [loading, setLoading] = useState(true)
  const [useMock, setUseMock] = useState(false)

  const loadDogs = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from('dogs').select('*').order('name')
      if (error) throw error
      setDogs(data as Dog[])
    } catch {
      setUseMock(true)
      setDogs(mockDogs)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDogs()
  }, [])

  async function deleteDog(id: string) {
    if (!confirm('Er du sikker på at du vil slette denne hund?')) return
    if (useMock) {
      setDogs(dogs.filter((d) => d.id !== id))
      return
    }
    const supabase = createClient()
    const { error } = await supabase.from('dogs').delete().eq('id', id)
    if (!error) setDogs(dogs.filter((d) => d.id !== id))
  }

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Indlæser...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Hunde</h1>
        <Link
          href="/admin/hunde/ny"
          className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
        >
          <Plus size={16} /> Tilføj hund
        </Link>
      </div>

      {useMock && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg px-4 py-3 text-sm mb-4">
          ⚠️ Supabase er ikke konfigureret — viser mock data. Ændringer gemmes ikke.
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Navn</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Køn</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden sm:table-cell">HD</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden sm:table-cell">AD</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Fremhævet</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">Handlinger</th>
              </tr>
            </thead>
            <tbody>
              {dogs.map((dog) => (
                <tr key={dog.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{dog.name}</td>
                  <td className="px-4 py-3 text-slate-600">
                    {dog.gender === 'male' ? '♂ Han' : '♀ Tæve'}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {dog.hd_score && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        <Shield size={10} /> {dog.hd_score}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {dog.ad_score && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                        {dog.ad_score}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {dog.is_featured ? '⭐' : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/hunde/${dog.id}`}
                        className="p-2 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Rediger"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => deleteDog(dog.id)}
                        className="p-2 text-slate-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Slet"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {dogs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    Ingen hunde endnu. Klik &quot;Tilføj hund&quot; for at oprette den første.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
