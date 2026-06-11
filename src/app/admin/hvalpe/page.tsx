'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Litter } from '@/lib/types'
import { mockLitters } from '@/lib/mock-data'
import { Plus, Trash2, Save, X } from 'lucide-react'

export default function AdminHvalpePage() {
  const [litters, setLitters] = useState<Litter[]>([])
  const [loading, setLoading] = useState(true)
  const [useMock, setUseMock] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    sire_name: '',
    dam_name: '',
    birth_date: '',
    males_count: 0,
    females_count: 0,
    available: true,
    description: '',
  })

  useEffect(() => {
    loadLitters()
  }, [])

  async function loadLitters() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from('litters').select('*').order('created_at', { ascending: false })
      if (error) throw error
      setLitters(data as Litter[])
    } catch {
      setUseMock(true)
      setLitters(mockLitters)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('litters').insert({
        ...form,
        birth_date: form.birth_date || null,
        description: form.description || null,
      })
      if (error) throw error
      setShowForm(false)
      setForm({ sire_name: '', dam_name: '', birth_date: '', males_count: 0, females_count: 0, available: true, description: '' })
      loadLitters()
    } catch {
      alert('Kunne ikke gemme. Er Supabase konfigureret?')
    } finally {
      setSaving(false)
    }
  }

  async function deleteLitter(id: string) {
    if (!confirm('Er du sikker?')) return
    if (useMock) {
      setLitters(litters.filter((l) => l.id !== id))
      return
    }
    const supabase = createClient()
    await supabase.from('litters').delete().eq('id', id)
    setLitters(litters.filter((l) => l.id !== id))
  }

  if (loading) return <div className="text-center py-12 text-slate-500">Indlæser...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Hvalpe / Kuld</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
        >
          {showForm ? <><X size={16} /> Annuller</> : <><Plus size={16} /> Nyt kuld</>}
        </button>
      </div>

      {useMock && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg px-4 py-3 text-sm mb-4">
          ⚠️ Supabase er ikke konfigureret — viser mock data.
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-6">
          <h2 className="font-bold text-slate-900 mb-4">Nyt kuld</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Far *</label>
              <input type="text" required value={form.sire_name} onChange={(e) => setForm({ ...form, sire_name: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mor *</label>
              <input type="text" required value={form.dam_name} onChange={(e) => setForm({ ...form, dam_name: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fødselsdato</label>
              <input type="date" value={form.birth_date} onChange={(e) => setForm({ ...form, birth_date: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Hanner</label>
                <input type="number" min={0} value={form.males_count} onChange={(e) => setForm({ ...form, males_count: parseInt(e.target.value) || 0 })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Tæver</label>
                <input type="number" min={0} value={form.females_count} onChange={(e) => setForm({ ...form, females_count: parseInt(e.target.value) || 0 })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Beskrivelse</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none resize-vertical" />
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} className="rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                <span className="text-sm font-medium text-slate-700">Ledige hvalpe</span>
              </label>
            </div>
          </div>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
            <Save size={16} /> {saving ? 'Gemmer...' : 'Gem kuld'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {litters.map((litter) => (
          <div key={litter.id} className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-slate-900">{litter.sire_name} × {litter.dam_name}</h3>
                <p className="text-sm text-slate-500 mt-1">
                  {litter.birth_date ? `Født ${new Date(litter.birth_date).toLocaleDateString('da-DK')}` : 'Planlagt'}
                  {' · '}{litter.males_count}♂ {litter.females_count}♀
                  {' · '}{litter.available ? '✅ Ledige' : '❌ Reserveret'}
                </p>
                {litter.description && <p className="text-sm text-slate-600 mt-2 line-clamp-2">{litter.description}</p>}
              </div>
              <button onClick={() => deleteLitter(litter.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Slet">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {litters.length === 0 && (
          <div className="text-center py-8 text-slate-400">Ingen kuld endnu.</div>
        )}
      </div>
    </div>
  )
}
