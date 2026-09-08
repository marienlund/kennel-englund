'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Dog } from '@/lib/types'
import { mockDogs } from '@/lib/mock-data'
import Link from 'next/link'
import { dogOrderKey, parseDogOrder, orderDogs, moveDog, type DogGender } from '@/lib/dog-order'
import { Plus, Pencil, Trash2, Shield, ArrowUp, ArrowDown } from 'lucide-react'

export default function AdminHundePage() {
  const [dogs, setDogs] = useState<Dog[]>([])
  const [loading, setLoading] = useState(true)
  const [useMock, setUseMock] = useState(false)

  const [gender, setGender] = useState<DogGender>('male')
  const [orders, setOrders] = useState<Record<DogGender, string[]>>({ male: [], female: [] })
  const [orderAvailable, setOrderAvailable] = useState(false)
  const [savingOrder, setSavingOrder] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const mutationPending = useRef(false)

  useEffect(() => {
    let cancelled = false
    async function loadDogs() {
      try {
        const supabase = createClient()
        const [dogResult, orderResult] = await Promise.all([
          supabase.from('dogs').select('*').order('name'),
          supabase.from('site_settings').select('id, value').in('id', [dogOrderKey('male'), dogOrderKey('female')]),
        ])
        if (dogResult.error) throw dogResult.error
        if (cancelled) return
        setDogs(dogResult.data as Dog[])
        if (orderResult.error) {
          setMessage({ type: 'error', text: 'Rækkefølgen kunne ikke indlæses. Genindlæs siden for at prøve igen.' })
        } else {
          setOrders({
            male: parseDogOrder(orderResult.data?.find(row => row.id === dogOrderKey('male'))?.value),
            female: parseDogOrder(orderResult.data?.find(row => row.id === dogOrderKey('female'))?.value),
          })
          setOrderAvailable(true)
        }
      } catch {
        if (!cancelled) { setUseMock(true); setDogs(mockDogs) }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void loadDogs()
    return () => { cancelled = true }
  }, [])

  const visibleDogs = orderDogs(dogs.filter(dog => dog.gender === gender), orders[gender])

  async function changeOrder(id: string, direction: -1 | 1) {
    if (mutationPending.current || useMock || !orderAvailable) return
    const ids = visibleDogs.map(dog => dog.id)
    const nextOrder = moveDog(ids, id, direction)
    if (nextOrder.every((value, index) => value === ids[index])) return
    mutationPending.current = true
    setSavingOrder(true)
    setMessage(null)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('site_settings').upsert({
        id: dogOrderKey(gender), value: JSON.stringify(nextOrder), updated_at: new Date().toISOString(),
      })
      if (error) throw error
      setOrders(current => ({ ...current, [gender]: nextOrder }))
      setMessage({ type: 'success', text: 'Rækkefølgen er gemt og vises på hjemmesiden.' })
    } catch {
      setMessage({ type: 'error', text: 'Rækkefølgen kunne ikke gemmes. Prøv igen.' })
    } finally {
      mutationPending.current = false
      setSavingOrder(false)
    }
  }

  async function deleteDog(id: string) {
    if (mutationPending.current) return
    if (!confirm('Er du sikker på at du vil slette denne hund?')) return
    if (useMock) {
      setDogs(dogs.filter((d) => d.id !== id))
      return
    }
    mutationPending.current = true
    setSavingOrder(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('dogs').delete().eq('id', id)
      if (error) throw error
      setDogs(current => current.filter(d => d.id !== id))
    } catch {
      setMessage({ type: 'error', text: 'Hunden kunne ikke slettes. Prøv igen.' })
    } finally {
      mutationPending.current = false
      setSavingOrder(false)
    }
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

      <div className="flex gap-2 mb-3" aria-label="Vælg hundeliste">
        {(['male', 'female'] as const).map(value => (
          <button key={value} type="button" aria-pressed={gender === value} disabled={savingOrder}
            onClick={() => { setGender(value); setMessage(current => current?.type === 'error' ? current : null) }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 ${gender === value ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
            {value === 'male' ? 'Avlshanner' : 'Avlstæver'}
          </button>
        ))}
      </div>
      <p className="text-sm text-slate-500 mb-4">Brug pilene til at flytte hundene op eller ned. Rækkefølgen gemmes automatisk for hver liste.</p>
      {message && <div role="status" className={`rounded-lg px-4 py-3 text-sm mb-4 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>{message.text}</div>}
      {savingOrder && <p role="status" className="text-sm text-slate-500 mb-3">Gemmer...</p>}

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
                <th className="text-center px-4 py-3 font-semibold text-slate-600">Rækkefølge</th>
                <th className="text-right px-4 py-3 font-semibold text-slate-600">Handlinger</th>
              </tr>
            </thead>
            <tbody>
              {visibleDogs.map((dog, index) => (
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
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button type="button" onClick={() => changeOrder(dog.id, -1)}
                        disabled={index === 0 || savingOrder || useMock || !orderAvailable}
                        aria-label={`Flyt ${dog.name} op`} title="Flyt op"
                        className="p-2 rounded-lg text-blue-700 hover:bg-blue-50 disabled:opacity-25 disabled:cursor-not-allowed">
                        <ArrowUp size={18} />
                      </button>
                      <button type="button" onClick={() => changeOrder(dog.id, 1)}
                        disabled={index === visibleDogs.length - 1 || savingOrder || useMock || !orderAvailable}
                        aria-label={`Flyt ${dog.name} ned`} title="Flyt ned"
                        className="p-2 rounded-lg text-blue-700 hover:bg-blue-50 disabled:opacity-25 disabled:cursor-not-allowed">
                        <ArrowDown size={18} />
                      </button>
                    </div>
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
                        disabled={savingOrder}
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
              {visibleDogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                    Ingen {gender === 'male' ? 'avlshanner' : 'avlstæver'} endnu. Klik &quot;Tilføj hund&quot; for at oprette den første.
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
