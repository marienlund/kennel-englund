'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Litter, LitterExtraPhoto } from '@/lib/types'
import { mockLitters } from '@/lib/mock-data'
import { Plus, Trash2, Save, X, Pencil, Upload } from 'lucide-react'

const emptyForm = {
  title: '',
  sire_name: '',
  dam_name: '',
  birth_date: '',
  males_count: 0,
  females_count: 0,
  available: true,
  description: '',
  sire_hd: '',
  sire_ad: '',
  sire_ocd: '',
  sire_training: '',
  dam_hd: '',
  dam_ad: '',
  dam_ocd: '',
  dam_training: '',
  sire_working_dog_url: '',
  dam_working_dog_url: '',
  sort_order: 0,
}

type FormState = typeof emptyForm

export default function AdminHvalpePage() {
  const [litters, setLitters] = useState<Litter[]>([])
  const [loading, setLoading] = useState(true)
  const [useMock, setUseMock] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>({ ...emptyForm })
  const [sireFile, setSireFile] = useState<File | null>(null)
  const [damFile, setDamFile] = useState<File | null>(null)
  const [sirePreview, setSirePreview] = useState<string | null>(null)
  const [damPreview, setDamPreview] = useState<string | null>(null)

  // Extra photos state
  const [extraPhotos, setExtraPhotos] = useState<Record<string, LitterExtraPhoto[]>>({})
  const [uploadingExtra, setUploadingExtra] = useState<string | null>(null)

  const loadExtraPhotos = useCallback(async (litterIds: string[]) => {
    if (litterIds.length === 0) return
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('litter_extra_photos')
        .select('*')
        .in('litter_id', litterIds)
        .order('sort_order', { ascending: true })
      if (error) throw error
      const grouped: Record<string, LitterExtraPhoto[]> = {}
      for (const photo of (data || []) as LitterExtraPhoto[]) {
        if (!grouped[photo.litter_id]) grouped[photo.litter_id] = []
        grouped[photo.litter_id].push(photo)
      }
      setExtraPhotos(grouped)
    } catch {
      // Table might not exist yet
    }
  }, [])

  useEffect(() => {
    loadLitters()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadLitters() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('litters')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
      if (error) throw error
      const littersData = data as Litter[]
      setLitters(littersData)
      await loadExtraPhotos(littersData.map(l => l.id))
    } catch {
      setUseMock(true)
      setLitters(mockLitters)
    } finally {
      setLoading(false)
    }
  }

  async function uploadPhoto(file: File, prefix: string): Promise<string | null> {
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop() || 'jpg'
      const path = `${prefix}-${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('dog-photos').upload(path, file, { upsert: true })
      if (error) throw error
      const { data: urlData } = supabase.storage.from('dog-photos').getPublicUrl(path)
      return urlData.publicUrl
    } catch (err) {
      console.error('Upload failed:', err)
      return null
    }
  }

  function startEdit(litter: Litter) {
    setEditingId(litter.id)
    setForm({
      title: litter.title || '',
      sire_name: litter.sire_name,
      dam_name: litter.dam_name,
      birth_date: litter.birth_date || '',
      males_count: litter.males_count,
      females_count: litter.females_count,
      available: litter.available,
      description: litter.description || '',
      sire_hd: litter.sire_hd || '',
      sire_ad: litter.sire_ad || '',
      sire_ocd: litter.sire_ocd || '',
      sire_training: litter.sire_training || '',
      dam_hd: litter.dam_hd || '',
      dam_ad: litter.dam_ad || '',
      dam_ocd: litter.dam_ocd || '',
      dam_training: litter.dam_training || '',
      sire_working_dog_url: litter.sire_working_dog_url || '',
      dam_working_dog_url: litter.dam_working_dog_url || '',
      sort_order: litter.sort_order || 0,
    })
    setSirePreview(litter.sire_photo_url || null)
    setDamPreview(litter.dam_photo_url || null)
    setSireFile(null)
    setDamFile(null)
    setShowForm(true)
  }

  function startNew() {
    setEditingId(null)
    setForm({ ...emptyForm })
    setSireFile(null)
    setDamFile(null)
    setSirePreview(null)
    setDamPreview(null)
    setShowForm(true)
  }

  function cancelForm() {
    setShowForm(false)
    setEditingId(null)
    setForm({ ...emptyForm })
    setSireFile(null)
    setDamFile(null)
    setSirePreview(null)
    setDamPreview(null)
  }

  function handleFileChange(which: 'sire' | 'dam', file: File | null) {
    if (which === 'sire') {
      setSireFile(file)
      setSirePreview(file ? URL.createObjectURL(file) : null)
    } else {
      setDamFile(file)
      setDamPreview(file ? URL.createObjectURL(file) : null)
    }
  }

  async function handleExtraPhotoUpload(litterId: string, parentType: 'sire' | 'dam', file: File) {
    const existing = (extraPhotos[litterId] || []).filter(p => p.parent_type === parentType)
    if (existing.length >= 4) {
      alert('Maks 4 ekstra fotos per forælder.')
      return
    }

    const slotKey = `${litterId}-${parentType}`
    setUploadingExtra(slotKey)

    try {
      const url = await uploadPhoto(file, `litter-extra-${parentType}`)
      if (!url) throw new Error('Upload failed')

      const supabase = createClient()
      const { error } = await supabase.from('litter_extra_photos').insert({
        litter_id: litterId,
        parent_type: parentType,
        photo_url: url,
        sort_order: existing.length,
      })
      if (error) throw error

      await loadExtraPhotos([litterId])
    } catch (err) {
      console.error('Extra photo upload failed:', err)
      alert('Kunne ikke uploade foto.')
    } finally {
      setUploadingExtra(null)
    }
  }

  async function deleteExtraPhoto(photo: LitterExtraPhoto) {
    if (!confirm('Slet dette foto?')) return
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('litter_extra_photos')
        .delete()
        .eq('id', photo.id)
      if (error) throw error

      // Also try to delete from storage
      try {
        const urlParts = photo.photo_url.split('/dog-photos/')
        if (urlParts[1]) {
          await supabase.storage.from('dog-photos').remove([urlParts[1]])
        }
      } catch {}

      await loadExtraPhotos([photo.litter_id])
    } catch (err) {
      console.error('Delete failed:', err)
      alert('Kunne ikke slette foto.')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const supabase = createClient()

      let sire_photo_url: string | null | undefined = undefined
      let dam_photo_url: string | null | undefined = undefined

      if (sireFile) {
        sire_photo_url = await uploadPhoto(sireFile, 'sire')
      }
      if (damFile) {
        dam_photo_url = await uploadPhoto(damFile, 'dam')
      }

      const payload: Record<string, unknown> = {
        title: form.title || null,
        sire_name: form.sire_name,
        dam_name: form.dam_name,
        birth_date: form.birth_date || null,
        males_count: form.males_count,
        females_count: form.females_count,
        available: form.available,
        description: form.description || null,
        sire_hd: form.sire_hd || null,
        sire_ad: form.sire_ad || null,
        sire_ocd: form.sire_ocd || null,
        sire_training: form.sire_training || null,
        dam_hd: form.dam_hd || null,
        dam_ad: form.dam_ad || null,
        dam_ocd: form.dam_ocd || null,
        dam_training: form.dam_training || null,
        sire_working_dog_url: form.sire_working_dog_url || null,
        dam_working_dog_url: form.dam_working_dog_url || null,
        sort_order: form.sort_order,
      }

      if (sire_photo_url !== undefined) payload.sire_photo_url = sire_photo_url
      if (dam_photo_url !== undefined) payload.dam_photo_url = dam_photo_url

      if (editingId) {
        const { error } = await supabase.from('litters').update(payload).eq('id', editingId)
        if (error) throw error
      } else {
        const { error } = await supabase.from('litters').insert(payload)
        if (error) throw error
      }

      cancelForm()
      loadLitters()
    } catch (err) {
      console.error(err)
      alert('Kunne ikke gemme. Er Supabase konfigureret?')
    } finally {
      setSaving(false)
    }
  }

  async function deleteLitter(id: string) {
    if (!confirm('Er du sikker på du vil slette dette kuld?')) return
    if (useMock) {
      setLitters(litters.filter((l) => l.id !== id))
      return
    }
    const supabase = createClient()
    await supabase.from('litters').delete().eq('id', id)
    setLitters(litters.filter((l) => l.id !== id))
  }

  function renderExtraPhotoSlots(litterId: string, parentType: 'sire' | 'dam') {
    const photos = (extraPhotos[litterId] || []).filter(p => p.parent_type === parentType)
    const slotKey = `${litterId}-${parentType}`
    const isUploading = uploadingExtra === slotKey
    const slots = []

    for (let i = 0; i < 4; i++) {
      const photo = photos[i]
      if (photo) {
        slots.push(
          <div key={photo.id} className="relative aspect-square bg-slate-50 rounded border border-slate-300 overflow-hidden group">
            <img src={photo.photo_url} alt={`Ekstra foto ${i + 1}`} className="w-full h-full object-cover" />
            <button
              onClick={() => deleteExtraPhoto(photo)}
              className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              title="Slet foto"
            >
              <X size={12} />
            </button>
          </div>
        )
      } else {
        slots.push(
          <label key={`empty-${i}`} className="aspect-square bg-slate-50 rounded border border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-blue-400 transition-colors">
            {isUploading && i === photos.length ? (
              <span className="text-xs text-slate-400">...</span>
            ) : (
              <>
                <Plus size={16} className="text-slate-300" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleExtraPhotoUpload(litterId, parentType, file)
                    e.target.value = ''
                  }}
                />
              </>
            )}
          </label>
        )
      }
    }

    return (
      <div className="grid grid-cols-4 gap-1">
        {slots}
      </div>
    )
  }

  if (loading) return <div className="text-center py-12 text-slate-500">Indlæser...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Hvalpe / Kuld</h1>
        <button
          onClick={() => showForm ? cancelForm() : startNew()}
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
          <h2 className="font-bold text-slate-900 mb-4">{editingId ? 'Rediger kuld' : 'Nyt kuld'}</h2>

          {/* Title & Sort */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Titel (f.eks. &quot;Englund&apos;s H-kuld&quot;)</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Sortering</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
          </div>

          {/* Basic info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Far (navn) *</label>
              <input type="text" required value={form.sire_name} onChange={(e) => setForm({ ...form, sire_name: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mor (navn) *</label>
              <input type="text" required value={form.dam_name} onChange={(e) => setForm({ ...form, dam_name: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fødselsdato</label>
              <input type="date" value={form.birth_date} onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Hanner</label>
                <input type="number" min={0} value={form.males_count} onChange={(e) => setForm({ ...form, males_count: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-1">Tæver</label>
                <input type="number" min={0} value={form.females_count} onChange={(e) => setForm({ ...form, females_count: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
              </div>
            </div>
          </div>

          {/* Photos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Foto af far</label>
              <div className="flex items-center gap-3">
                {sirePreview && <img src={sirePreview} alt="Far preview" className="w-16 h-16 object-cover rounded border" />}
                <label className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-3 py-2 rounded-lg cursor-pointer transition-colors border border-slate-300">
                  <Upload size={14} /> Vælg fil
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange('sire', e.target.files?.[0] || null)} />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Foto af mor</label>
              <div className="flex items-center gap-3">
                {damPreview && <img src={damPreview} alt="Mor preview" className="w-16 h-16 object-cover rounded border" />}
                <label className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium px-3 py-2 rounded-lg cursor-pointer transition-colors border border-slate-300">
                  <Upload size={14} /> Vælg fil
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange('dam', e.target.files?.[0] || null)} />
                </label>
              </div>
            </div>
          </div>

          {/* Extra photos (only when editing existing litter) */}
          {editingId && (
            <div className="mb-4 border-t pt-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Ekstra fotos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-2">Far — ekstra fotos (maks 4)</label>
                  {renderExtraPhotoSlots(editingId, 'sire')}
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-2">Mor — ekstra fotos (maks 4)</label>
                  {renderExtraPhotoSlots(editingId, 'dam')}
                </div>
              </div>
            </div>
          )}

          {/* Health data - Sire */}
          <h3 className="text-sm font-semibold text-slate-800 mb-2 mt-4 border-t pt-4">Sundhedsdata — Far</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">HD</label>
              <input type="text" value={form.sire_hd} onChange={(e) => setForm({ ...form, sire_hd: e.target.value })} placeholder="f.eks. HD-A"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">AD</label>
              <input type="text" value={form.sire_ad} onChange={(e) => setForm({ ...form, sire_ad: e.target.value })} placeholder="f.eks. AD 0"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">OCD</label>
              <input type="text" value={form.sire_ocd} onChange={(e) => setForm({ ...form, sire_ocd: e.target.value })} placeholder="f.eks. Fri"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Uddannelse</label>
              <input type="text" value={form.sire_training} onChange={(e) => setForm({ ...form, sire_training: e.target.value })} placeholder="f.eks. IPO1"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
          </div>

          {/* Health data - Dam */}
          <h3 className="text-sm font-semibold text-slate-800 mb-2">Sundhedsdata — Mor</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">HD</label>
              <input type="text" value={form.dam_hd} onChange={(e) => setForm({ ...form, dam_hd: e.target.value })} placeholder="f.eks. HD-A"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">AD</label>
              <input type="text" value={form.dam_ad} onChange={(e) => setForm({ ...form, dam_ad: e.target.value })} placeholder="f.eks. AD 0"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">OCD</label>
              <input type="text" value={form.dam_ocd} onChange={(e) => setForm({ ...form, dam_ocd: e.target.value })} placeholder="f.eks. Fri"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Uddannelse</label>
              <input type="text" value={form.dam_training} onChange={(e) => setForm({ ...form, dam_training: e.target.value })} placeholder="f.eks. BH"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
          </div>

          {/* Working Dog URLs */}
          <h3 className="text-sm font-semibold text-slate-800 mb-2 border-t pt-4">Working Dog links</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Far — Working Dog URL</label>
              <input type="url" value={form.sire_working_dog_url} onChange={(e) => setForm({ ...form, sire_working_dog_url: e.target.value })} placeholder="https://..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Mor — Working Dog URL</label>
              <input type="url" value={form.dam_working_dog_url} onChange={(e) => setForm({ ...form, dam_working_dog_url: e.target.value })} placeholder="https://..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Beskrivelse</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none resize-vertical" />
          </div>

          {/* Available + Submit */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
              <span className="text-sm font-medium text-slate-700">Ledige hvalpe</span>
            </label>
            <button type="submit" disabled={saving}
              className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
              <Save size={16} /> {saving ? 'Gemmer...' : editingId ? 'Opdater kuld' : 'Gem kuld'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {litters.map((litter) => {
          const sireExtras = (extraPhotos[litter.id] || []).filter(p => p.parent_type === 'sire')
          const damExtras = (extraPhotos[litter.id] || []).filter(p => p.parent_type === 'dam')
          const hasExtras = sireExtras.length > 0 || damExtras.length > 0

          return (
            <div key={litter.id} className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {(litter.sire_photo_url || litter.dam_photo_url) && (
                    <div className="flex gap-1 flex-shrink-0">
                      {litter.sire_photo_url && <img src={litter.sire_photo_url} alt="Far" className="w-12 h-12 object-cover rounded" />}
                      {litter.dam_photo_url && <img src={litter.dam_photo_url} alt="Mor" className="w-12 h-12 object-cover rounded" />}
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-slate-900">{litter.title || `${litter.sire_name} × ${litter.dam_name}`}</h3>
                    <p className="text-sm text-slate-500 mt-0.5">{litter.sire_name} × {litter.dam_name}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      {litter.birth_date ? `Født ${new Date(litter.birth_date).toLocaleDateString('da-DK')}` : 'Planlagt'}
                      {' · '}{litter.males_count}♂ {litter.females_count}♀
                      {' · '}{litter.available ? '✅ Ledige' : '❌ Reserveret'}
                      {litter.sort_order != null ? ` · #${litter.sort_order}` : ''}
                    </p>
                    {hasExtras && (
                      <p className="text-xs text-slate-400 mt-1">
                        📷 {sireExtras.length} ekstra far-foto, {damExtras.length} ekstra mor-foto
                      </p>
                    )}
                    {litter.description && <p className="text-sm text-slate-600 mt-2 line-clamp-2">{litter.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => startEdit(litter)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Rediger">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => deleteLitter(litter.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Slet">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
        {litters.length === 0 && (
          <div className="text-center py-8 text-slate-400">Ingen kuld endnu.</div>
        )}
      </div>
    </div>
  )
}
