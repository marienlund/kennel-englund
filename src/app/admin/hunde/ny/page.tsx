'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Upload } from 'lucide-react'

export default function NyHundPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    gender: 'male',
    birthdate: '',
    sire_name: '',
    dam_name: '',
    hd_score: '',
    ad_score: '',
    ocd_status: '',
    mental_description: '',
    training_results: '',
    achievements: '',
    is_featured: false,
  })

  const [photos, setPhotos] = useState<File[]>([])

  const update = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      const supabase = createClient()

      const { data: dog, error: insertError } = await supabase
        .from('dogs')
        .insert({
          ...form,
          birthdate: form.birthdate || null,
          sire_name: form.sire_name || null,
          dam_name: form.dam_name || null,
          hd_score: form.hd_score || null,
          ad_score: form.ad_score || null,
          ocd_status: form.ocd_status || null,
          mental_description: form.mental_description || null,
          training_results: form.training_results || null,
          achievements: form.achievements || null,
        })
        .select()
        .single()

      if (insertError) throw insertError

      // Upload photos
      for (let i = 0; i < photos.length; i++) {
        const file = photos[i]
        const ext = file.name.split('.').pop()
        const path = `dogs/${dog.id}/${i}-${Date.now()}.${ext}`

        const { error: uploadError } = await supabase.storage
          .from('dog-photos')
          .upload(path, file)

        if (!uploadError) {
          await supabase.from('dog_photos').insert({
            dog_id: dog.id,
            storage_path: path,
            sort_order: i,
          })
        }
      }

      router.push('/admin/hunde')
    } catch {
      setError('Kunne ikke gemme hunden. Er Supabase konfigureret?')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/hunde"
        className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-800 text-sm font-medium mb-4"
      >
        <ArrowLeft size={16} /> Tilbage
      </Link>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Tilføj ny hund</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 mb-4">Grundlæggende oplysninger</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Navn *</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                placeholder="f.eks. Rex vom Haus Englund"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Køn *</label>
              <select
                value={form.gender}
                onChange={(e) => update('gender', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              >
                <option value="male">Han</option>
                <option value="female">Tæve</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fødselsdato</label>
              <input
                type="date"
                value={form.birthdate}
                onChange={(e) => update('birthdate', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Far (sire)</label>
              <input
                type="text"
                value={form.sire_name}
                onChange={(e) => update('sire_name', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mor (dam)</label>
              <input
                type="text"
                value={form.dam_name}
                onChange={(e) => update('dam_name', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => update('is_featured', e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-600"
                />
                <span className="text-sm font-medium text-slate-700">Vis på forsiden (fremhævet)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Health */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 mb-4">Sundhed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">HD score</label>
              <input
                type="text"
                value={form.hd_score}
                onChange={(e) => update('hd_score', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                placeholder="f.eks. HD-A"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">AD score</label>
              <input
                type="text"
                value={form.ad_score}
                onChange={(e) => update('ad_score', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                placeholder="f.eks. AD 0/0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">OCD status</label>
              <input
                type="text"
                value={form.ocd_status}
                onChange={(e) => update('ocd_status', e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                placeholder="f.eks. Fri"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 mb-4">Beskrivelse</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mentalbeskrivelse</label>
              <textarea
                value={form.mental_description}
                onChange={(e) => update('mental_description', e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none resize-vertical"
                placeholder="Beskriv hundens mentalitet..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Uddannelse & Resultater</label>
              <textarea
                value={form.training_results}
                onChange={(e) => update('training_results', e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none resize-vertical"
                placeholder="BH/VT, IPO-resultater, sporhund..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Præstationer</label>
              <textarea
                value={form.achievements}
                onChange={(e) => update('achievements', e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none resize-vertical"
                placeholder="Udstillingsresultater, titler..."
              />
            </div>
          </div>
        </div>

        {/* Photos */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 mb-4">Fotos</h2>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-8 cursor-pointer hover:border-blue-400 transition-colors">
            <Upload size={24} className="text-slate-400 mb-2" />
            <span className="text-sm text-slate-500">
              {photos.length > 0 ? `${photos.length} fil(er) valgt` : 'Klik for at vælge fotos'}
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => setPhotos(Array.from(e.target.files || []))}
            />
          </label>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm"
          >
            <Save size={16} />
            {saving ? 'Gemmer...' : 'Gem hund'}
          </button>
          <Link href="/admin/hunde" className="text-sm text-slate-500 hover:text-slate-700">
            Annuller
          </Link>
        </div>
      </form>
    </div>
  )
}
