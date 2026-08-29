'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Plus, Trash2, Upload, X, ChevronUp, ChevronDown } from 'lucide-react'

interface Result {
  id?: string
  year: string
  title: string
  dog_name: string
  handler: string
  result_type: string
  sort_order: number
  description?: string
  image_url?: string
  isNew?: boolean
}

export default function AdminResultaterPage() {
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [noTable, setNoTable] = useState(false)
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null)

  useEffect(() => {
    loadResults()
  }, [])

  async function loadResults() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('results')
        .select('*')
        .order('sort_order', { ascending: true })
      if (error) throw error
      setResults(data || [])
    } catch {
      setNoTable(true)
    } finally {
      setLoading(false)
    }
  }

  function addResult() {
    const today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    setResults([
      {
        year: `${dd}.${mm}.${yyyy}`,
        title: '',
        dog_name: '',
        handler: '',
        result_type: '',
        sort_order: 0,
        description: '',
        image_url: '',
        isNew: true,
      },
      ...results,
    ])
  }

  function updateResult(index: number, field: keyof Result, value: string | number) {
    const updated = [...results]
    updated[index] = { ...updated[index], [field]: value }
    setResults(updated)
  }

  async function handleImageUpload(index: number, file: File) {
    setUploadingIndex(index)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const fileName = `results/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      
      const { error: uploadError } = await supabase.storage
        .from('dog-photos')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })
      
      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('dog-photos')
        .getPublicUrl(fileName)

      updateResult(index, 'image_url', urlData.publicUrl)
      setMessage({ type: 'success', text: 'Billede uploadet!' })
    } catch {
      setMessage({ type: 'error', text: 'Kunne ikke uploade billede.' })
    } finally {
      setUploadingIndex(null)
    }
  }

  function removeImage(index: number) {
    updateResult(index, 'image_url', '')
  }

  async function deleteResult(index: number) {
    const result = results[index]
    if (result.id) {
      const supabase = createClient()
      const { error } = await supabase.from('results').delete().eq('id', result.id)
      if (error) {
        setMessage({ type: 'error', text: 'Kunne ikke slette.' })
        return
      }
    }
    setResults(results.filter((_, i) => i !== index))
    setMessage({ type: 'success', text: 'Resultat slettet.' })
  }

  async function moveResult(index: number, direction: number) {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= results.length) return
    const updated = [...results]
    const temp = updated[index]
    updated[index] = updated[newIndex]
    updated[newIndex] = temp
    // Update sort_order for all
    updated.forEach((r, i) => { r.sort_order = i })
    setResults(updated)

    // Auto-save sort order to Supabase
    const supabase = createClient()
    for (const r of updated) {
      if (r.id && !r.isNew) {
        await supabase.from('results').update({ sort_order: r.sort_order }).eq('id', r.id)
      }
    }
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      const supabase = createClient()
      for (const r of results) {
        const row = {
          year: r.year,
          title: r.title,
          dog_name: r.dog_name || '',
          handler: r.handler || '',
          result_type: r.result_type || 'other',
          sort_order: r.sort_order,
          description: r.description || null,
          image_url: r.image_url || null,
        }
        if (r.id && !r.isNew) {
          const { error } = await supabase.from('results').update(row).eq('id', r.id)
          if (error) { console.error('Update error:', error); throw error }
        } else {
          const { error } = await supabase.from('results').insert(row)
          if (error) { console.error('Insert error:', error); throw error }
        }
      }
      setMessage({ type: 'success', text: 'Resultater gemt!' })
      await loadResults()
    } catch {
      setMessage({ type: 'error', text: 'Kunne ikke gemme. Er Supabase konfigureret og SQL kørt?' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-12 text-slate-500">Indlæser...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Resultater</h1>
        <div className="flex gap-2">
          <button
            onClick={addResult}
            disabled={noTable}
            className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-700 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <Plus size={16} /> Tilføj resultat
          </button>
          <button
            onClick={handleSave}
            disabled={saving || noTable}
            className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
          >
            <Save size={16} /> {saving ? 'Gemmer...' : 'Gem alle'}
          </button>
        </div>
      </div>

      {noTable && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg px-4 py-3 text-sm mb-4">
          ⚠️ Tabellen <code>results</code> findes ikke endnu. Kør SQL-scriptet i Supabase SQL Editor først.
        </div>
      )}

      {message && (
        <div className={`rounded-lg px-4 py-3 text-sm mb-4 ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-3">
        {results.length === 0 && !noTable && (
          <p className="text-slate-500 text-center py-8">Ingen resultater endnu. Klik &quot;Tilføj resultat&quot; for at begynde.</p>
        )}
        {results.map((r, i) => (
          <div key={r.id || `new-${i}`} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Dato</label>
                <input
                  type="text"
                  value={r.year}
                  onChange={(e) => updateResult(i, 'year', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                  placeholder="dd.mm.yyyy"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-500 mb-1">Titel</label>
                <input
                  type="text"
                  value={r.title}
                  onChange={(e) => updateResult(i, 'title', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                  placeholder="DM Guld"
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-slate-500 mb-1">Hundens navn</label>
                <input
                  type="text"
                  value={r.dog_name}
                  onChange={(e) => updateResult(i, 'dog_name', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                  placeholder="Team Englund's..."
                />
              </div>
              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-slate-500 mb-1">Fører</label>
                <input
                  type="text"
                  value={r.handler}
                  onChange={(e) => updateResult(i, 'handler', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                  placeholder="Navn, Klub"
                />
              </div>
              <div className="sm:col-span-1 flex justify-end items-center gap-1">
                <div className="flex flex-col">
                  <button
                    onClick={() => moveResult(i, -1)}
                    disabled={i === 0}
                    className="p-0.5 text-slate-400 hover:text-blue-600 disabled:opacity-20 transition-colors"
                    title="Flyt op"
                  >
                    <ChevronUp size={16} />
                  </button>
                  <button
                    onClick={() => moveResult(i, 1)}
                    disabled={i === results.length - 1}
                    className="p-0.5 text-slate-400 hover:text-blue-600 disabled:opacity-20 transition-colors"
                    title="Flyt ned"
                  >
                    <ChevronDown size={16} />
                  </button>
                </div>
                <button
                  onClick={() => deleteResult(i)}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                  title="Slet"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Description + Image row */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mt-3 items-start">
              <div className="sm:col-span-7">
                <label className="block text-xs font-medium text-slate-500 mb-1">Beskrivelse</label>
                <textarea
                  value={r.description || ''}
                  onChange={(e) => updateResult(i, 'description', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-2 py-1.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none resize-y"
                  rows={2}
                  placeholder="Ekstra information om resultatet..."
                />
              </div>
              <div className="sm:col-span-5">
                <label className="block text-xs font-medium text-slate-500 mb-1">Billede</label>
                {r.image_url ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={r.image_url}
                      alt="Resultat billede"
                      className="h-16 w-16 object-cover rounded-lg border border-slate-200"
                    />
                    <button
                      onClick={() => removeImage(i)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                      title="Fjern billede"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium px-3 py-1.5 rounded-lg transition-colors text-sm cursor-pointer border border-slate-300">
                    <Upload size={14} />
                    {uploadingIndex === i ? 'Uploader...' : 'Upload billede'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(i, file)
                      }}
                      disabled={uploadingIndex === i}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
