'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Save, Upload, X, Plus, Trash2 } from 'lucide-react'
import { mockDogs } from '@/lib/mock-data'
import type { DogPhoto } from '@/lib/types'

export default function EditHundPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPhotoUrl, setCurrentPhotoUrl] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Extra photos state
  const [extraPhotos, setExtraPhotos] = useState<DogPhoto[]>([])
  const [extraUploading, setExtraUploading] = useState(false)
  const [extraUploadStatus, setExtraUploadStatus] = useState<string | null>(null)
  const extraFileInputRef = useRef<HTMLInputElement>(null)

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
    sort_order: 0,
  })

  const loadDog = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from('dogs').select('*').eq('id', id).single()
      if (error) throw error
      setForm({
        name: data.name || '',
        gender: data.gender || 'male',
        birthdate: data.birthdate || '',
        sire_name: data.sire_name || '',
        dam_name: data.dam_name || '',
        hd_score: data.hd_score || '',
        ad_score: data.ad_score || '',
        ocd_status: data.ocd_status || '',
        mental_description: data.mental_description || '',
        training_results: data.training_results || '',
        achievements: data.achievements || '',
        is_featured: data.is_featured || false,
        sort_order: data.sort_order || 0,
      })
      if (data.photo_url) {
        setCurrentPhotoUrl(data.photo_url)
      }
    } catch {
      // Fall back to mock
      const mock = mockDogs.find((d) => d.id === id)
      if (mock) {
        setForm({
          name: mock.name,
          gender: mock.gender,
          birthdate: mock.birthdate || '',
          sire_name: mock.sire_name || '',
          dam_name: mock.dam_name || '',
          hd_score: mock.hd_score || '',
          ad_score: mock.ad_score || '',
          ocd_status: mock.ocd_status || '',
          mental_description: mock.mental_description || '',
          training_results: mock.training_results || '',
          achievements: mock.achievements || '',
          is_featured: mock.is_featured,
        })
        if (mock.photo_url) {
          setCurrentPhotoUrl(mock.photo_url)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const loadExtraPhotos = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('dog_photos')
        .select('*')
        .eq('dog_id', id)
        .order('sort_order', { ascending: true })
      if (error) throw error
      setExtraPhotos(data || [])
    } catch {
      // Ignore - extra photos just won't show
    }
  }

  const handleExtraPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setExtraUploading(true)
    setExtraUploadStatus('Uploader...')
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop() || 'jpg'
      const path = `dogs/${id}/extra_${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('dog-photos')
        .upload(path, file, { upsert: true })
      if (uploadError) throw uploadError

      const nextSort = extraPhotos.length > 0
        ? Math.max(...extraPhotos.map(p => p.sort_order)) + 1
        : 0

      const { error: insertError } = await supabase
        .from('dog_photos')
        .insert({
          dog_id: id,
          storage_path: path,
          sort_order: nextSort,
        })
      if (insertError) throw insertError

      setExtraUploadStatus('Foto tilføjet!')
      await loadExtraPhotos()
    } catch (err) {
      setExtraUploadStatus(`Fejl: ${err instanceof Error ? err.message : 'Ukendt fejl'}`)
    } finally {
      setExtraUploading(false)
      if (extraFileInputRef.current) extraFileInputRef.current.value = ''
      setTimeout(() => setExtraUploadStatus(null), 3000)
    }
  }

  const handleDeleteExtraPhoto = async (photo: DogPhoto) => {
    if (!confirm('Slet dette foto?')) return
    try {
      const supabase = createClient()
      // Delete from storage
      await supabase.storage.from('dog-photos').remove([photo.storage_path])
      // Delete from database
      await supabase.from('dog_photos').delete().eq('id', photo.id)
      await loadExtraPhotos()
    } catch {
      setExtraUploadStatus('Fejl ved sletning')
      setTimeout(() => setExtraUploadStatus(null), 3000)
    }
  }

  const getExtraPhotoUrl = (photo: DogPhoto): string => {
    const supabase = createClient()
    const { data: { publicUrl } } = supabase.storage
      .from('dog-photos')
      .getPublicUrl(photo.storage_path)
    return publicUrl
  }

  useEffect(() => {
    loadDog()
    loadExtraPhotos()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const update = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoFile(file)
    const url = URL.createObjectURL(file)
    setPhotoPreview(url)
    setUploadStatus(null)
  }

  const clearPhoto = () => {
    setPhotoFile(null)
    if (photoPreview) URL.revokeObjectURL(photoPreview)
    setPhotoPreview(null)
    setUploadStatus(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const uploadPhoto = async (supabase: ReturnType<typeof createClient>, dogId: string): Promise<string | null> => {
    if (!photoFile) return null
    const ext = photoFile.name.split('.').pop() || 'jpg'
    const path = `dogs/${dogId}/${Date.now()}.${ext}`

    setUploadStatus('Uploader foto...')
    const { error: uploadError } = await supabase.storage
      .from('dog-photos')
      .upload(path, photoFile, { upsert: true })

    if (uploadError) {
      setUploadStatus(`Fejl: ${uploadError.message}`)
      throw uploadError
    }

    const { data: { publicUrl } } = supabase.storage
      .from('dog-photos')
      .getPublicUrl(path)

    setUploadStatus('Foto uploadet!')
    return publicUrl
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      const supabase = createClient()

      // Upload photo first if selected
      let photoUrl: string | null | undefined
      if (photoFile) {
        photoUrl = await uploadPhoto(supabase, id)
      }

      const updateData: Record<string, unknown> = {
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
        updated_at: new Date().toISOString(),
      }

      if (photoUrl) {
        updateData.photo_url = photoUrl
      } else if (!currentPhotoUrl && !photoFile) {
        // Photo was cleared
        updateData.photo_url = null
      }

      const { error } = await supabase
        .from('dogs')
        .update(updateData)
        .eq('id', id)

      if (error) throw error
      router.push('/admin/hunde')
    } catch {
      setError('Kunne ikke opdatere hunden. Er Supabase konfigureret?')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-12 text-slate-500">Indlæser...</div>

  const displayPhotoUrl = photoPreview || currentPhotoUrl

  return (
    <div className="max-w-3xl">
      <Link href="/admin/hunde" className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-800 text-sm font-medium mb-4">
        <ArrowLeft size={16} /> Tilbage
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Rediger hund</h1>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main photo section */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 mb-4">Hovedfoto</h2>
          {displayPhotoUrl && (
            <div className="relative mb-4 inline-block">
              <Image
                src={displayPhotoUrl}
                alt={form.name || 'Hundefoto'}
                width={300}
                height={300}
                className="rounded-lg object-cover w-[300px] h-[300px]"
                unoptimized
              />
              <button
                type="button"
                onClick={() => {
                  clearPhoto()
                  setCurrentPhotoUrl(null)

                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                title="Slet foto"
              >
                <X size={16} />
              </button>
            </div>
          )}
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-6 cursor-pointer hover:border-blue-400 transition-colors">
            <Upload size={24} className="text-slate-400 mb-2" />
            <span className="text-sm text-slate-500">
              {photoFile ? photoFile.name : (currentPhotoUrl ? 'Klik for at vælge nyt foto' : 'Klik for at vælge foto')}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoSelect}
            />
          </label>
          {uploadStatus && (
            <p className={`text-sm mt-2 ${uploadStatus.startsWith('Fejl') ? 'text-red-600' : 'text-green-600'}`}>
              {uploadStatus}
            </p>
          )}
        </div>

        {/* Extra photos section */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 mb-4">Ekstra fotos</h2>
          
          {/* Existing extra photos */}
          {extraPhotos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {extraPhotos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <Image
                    src={getExtraPhotoUrl(photo)}
                    alt={photo.caption || 'Ekstra foto'}
                    width={200}
                    height={200}
                    className="rounded-lg object-cover w-full aspect-square"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteExtraPhoto(photo)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    title="Slet foto"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {extraPhotos.length === 0 && (
            <p className="text-sm text-slate-400 mb-4">Ingen ekstra fotos endnu.</p>
          )}

          {/* Upload button */}
          <label className={`flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-4 cursor-pointer hover:border-blue-400 transition-colors ${extraUploading ? 'opacity-50 pointer-events-none' : ''}`}>
            <Plus size={20} className="text-slate-400 mb-1" />
            <span className="text-sm text-slate-500">
              {extraUploading ? 'Uploader...' : 'Tilføj ekstra foto'}
            </span>
            <input
              ref={extraFileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleExtraPhotoUpload}
              disabled={extraUploading}
            />
          </label>
          {extraUploadStatus && (
            <p className={`text-sm mt-2 ${extraUploadStatus.startsWith('Fejl') ? 'text-red-600' : 'text-green-600'}`}>
              {extraUploadStatus}
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 mb-4">Grundlæggende oplysninger</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Navn *</label>
              <input type="text" required value={form.name} onChange={(e) => update('name', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Køn *</label>
              <select value={form.gender} onChange={(e) => update('gender', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none">
                <option value="male">Han</option>
                <option value="female">Tæve</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fødselsdato</label>
              <input type="date" value={form.birthdate} onChange={(e) => update('birthdate', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Far (sire)</label>
              <input type="text" value={form.sire_name} onChange={(e) => update('sire_name', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mor (dam)</label>
              <input type="text" value={form.dam_name} onChange={(e) => update('dam_name', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rækkefølge (lavt tal = øverst)</label>
              <input type="number" value={form.sort_order} onChange={(e) => update('sort_order', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_featured} onChange={(e) => update('is_featured', e.target.checked)} className="rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                <span className="text-sm font-medium text-slate-700">Fremhævet på forsiden</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 mb-4">Sundhed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">HD score</label>
              <input type="text" value={form.hd_score} onChange={(e) => update('hd_score', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">AD score</label>
              <input type="text" value={form.ad_score} onChange={(e) => update('ad_score', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">OCD status</label>
              <input type="text" value={form.ocd_status} onChange={(e) => update('ocd_status', e.target.value)} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 mb-4">Beskrivelse</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mentalbeskrivelse</label>
              <textarea value={form.mental_description} onChange={(e) => update('mental_description', e.target.value)} rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none resize-vertical" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Uddannelse & Resultater</label>
              <textarea value={form.training_results} onChange={(e) => update('training_results', e.target.value)} rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none resize-vertical" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Præstationer</label>
              <textarea value={form.achievements} onChange={(e) => update('achievements', e.target.value)} rows={3} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none resize-vertical" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm">
            <Save size={16} /> {saving ? 'Gemmer...' : 'Gem ændringer'}
          </button>
          <Link href="/admin/hunde" className="text-sm text-slate-500 hover:text-slate-700">Annuller</Link>
        </div>
      </form>
    </div>
  )
}
