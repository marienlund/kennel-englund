'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Upload, Trash2, ArrowUp } from 'lucide-react'
import { parseAboutPhotos, validateAboutPhoto, MAX_ABOUT_PHOTOS, type AboutPhoto } from '@/lib/about-photos'

const DEFAULT_CONTENT = `Kennel Team Englund blev grundlagt i 1984 med en simpel vision: at opdrætte schæferhunde der er mentalt stærke, sunde og brugbare.

Gennem mere end 40 års erfaring har vi opbygget et solidt avlsprogram baseret på de bedste europæiske blodlinjer. Vi har gennem årene produceret talrige hunde der har udmærket sig både i udstillingsringen og på brugsprøvebanen.

Vi tror på, at en god schæferhund starter med et godt gemyt. Mentalitet er altid vores højeste prioritet i avlsarbejdet. En hund med et stærkt nervesystem, god selvtillid og naturlig kontaktsøgen er fundamentet for alt andet — hvad enten det drejer sig om familieliv, brugsprøver eller udstilling.

Alle vores avlsdyr er mentalt beskrevne, røntgenfotograferet for HD og AD, og OCD-undersøgt. Vi accepterer ingen kompromiser når det gælder sundhed. Vores mål er at producere hunde der er sunde i krop og sind, med et væsen der gør dem til fremragende familiehunde og brugshunde.`

export default function AdminOmOsPage() {
  const [content, setContent] = useState(DEFAULT_CONTENT)
  const [contentEdited, setContentEdited] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [loadError, setLoadError] = useState(false)
  const [photos, setPhotos] = useState<AboutPhoto[]>([])
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    async function loadContent() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from('site_settings')
          .select('id, value').in('id', ['om_os_content', 'om_os_photos'])
        if (error) throw error
        if (cancelled) return
        const text = data?.find(row => row.id === 'om_os_content')?.value
        if (text) setContent(text)
        setPhotos(parseAboutPhotos(data?.find(row => row.id === 'om_os_photos')?.value))
      } catch {
        if (!cancelled) setLoadError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void loadContent()
    return () => { cancelled = true }
  }, [])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    e.target.value = ''
    if (!files.length || uploading || saving) return
    if (photos.length + files.length > MAX_ABOUT_PHOTOS) {
      setMessage({ type: 'error', text: `Du kan højst have ${MAX_ABOUT_PHOTOS} billeder på siden.` })
      return
    }
    for (const file of files) {
      const error = validateAboutPhoto(file)
      if (error) {
        setMessage({ type: 'error', text: `${file.name}: ${error}` })
        return
      }
    }
    setUploading(true)
    setMessage(null)
    let uploaded = 0
    try {
      const supabase = createClient()
      for (const file of files) {
        const extensions: Record<string, string> = {
          'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif',
        }
        const path = `om-os/${crypto.randomUUID()}.${extensions[file.type]}`
        const { error } = await supabase.storage.from('dog-photos')
          .upload(path, file, { contentType: file.type })
        if (error) throw error
        const { data } = supabase.storage.from('dog-photos').getPublicUrl(path)
        setPhotos(current => [...current, { url: data.publicUrl, caption: '' }])
        uploaded++
      }
      setMessage({ type: 'success', text: 'Billeder uploadet. Klik på “Gem ændringer” for at vise dem på siden.' })
    } catch {
      setMessage({ type: 'error', text: uploaded
        ? `${uploaded} billede(r) uploadet, men resten mislykkedes. Gem de uploadede billeder, og prøv resten igen.`
        : 'Billederne kunne ikke uploades. Kontrollér forbindelsen, og at du er logget ind som administrator.' })
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    if (uploading || saving || loadError) return
    setSaving(true)
    setMessage(null)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('site_settings')
        .upsert([
          ...(contentEdited ? [{ id: 'om_os_content', value: content, updated_at: new Date().toISOString() }] : []),
          { id: 'om_os_photos', value: JSON.stringify(photos), updated_at: new Date().toISOString() },
        ])
      if (error) throw error
      setContentEdited(false)
      setMessage({ type: 'success', text: 'Indhold gemt!' })
    } catch {
      setMessage({ type: 'error', text: 'Kunne ikke gemme. Er Supabase konfigureret?' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-center py-12 text-slate-500">Indlæser...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Om os</h1>
        <button
          onClick={handleSave}
          disabled={saving || uploading || loadError}
          className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
        >
          <Save size={16} /> {saving ? 'Gemmer...' : 'Gem ændringer'}
        </button>
      </div>

      {loadError && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg px-4 py-3 text-sm mb-4">
          Indholdet kunne ikke indlæses. Genindlæs siden for at prøve igen.
        </div>
      )}

      {message && (
        <div role="status" className={`rounded-lg px-4 py-3 text-sm mb-4 ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <section className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-6" aria-labelledby="photos-heading">
        <h2 id="photos-heading" className="font-bold text-slate-900 mb-2">Billeder</h2>
        <p className="text-sm text-slate-500 mb-4">
          Det første billede vises stort øverst. De øvrige vises i et galleri.
          Vælg JPG, PNG, WebP eller GIF, højst 10 MB pr. billede og 20 billeder i alt.
          Husk at gemme ændringerne.
        </p>
        <input ref={fileRef} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif"
          aria-label="Vælg billeder til Om os" onChange={handleImageUpload} className="hidden" />
        <button type="button" onClick={() => fileRef.current?.click()}
          disabled={uploading || saving || loadError || photos.length >= MAX_ABOUT_PHOTOS}
          className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg text-sm">
          <Upload size={16} /> {uploading ? 'Uploader...' : 'Upload billeder'}
        </button>
        {photos.length === 0 && <p className="text-sm text-slate-500 mt-4">Der er endnu ingen billeder.</p>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
          {photos.map((photo, index) => (
            <div key={photo.url} className="border border-slate-200 rounded-xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt={photo.caption || `Billede ${index + 1}`} className="w-full h-48 object-contain bg-slate-50" />
              <div className="p-3 space-y-3">
                <p className="text-sm font-medium text-slate-700">{index === 0 ? 'Øverste billede' : `Billede ${index + 1}`}</p>
                <label className="block text-sm text-slate-700">
                  Billedtekst (valgfri)
                  <input value={photo.caption} maxLength={300} disabled={saving || uploading}
                    onChange={e => setPhotos(current => current.map((item, i) => i === index ? { ...item, caption: e.target.value } : item))}
                    className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2" />
                </label>
                <div className="flex flex-wrap gap-3">
                  {index > 0 && <button type="button" disabled={saving || uploading}
                    onClick={() => setPhotos(current => [current[index], ...current.filter((_, i) => i !== index)])}
                    className="inline-flex items-center gap-1 text-sm text-blue-700 disabled:opacity-50">
                    <ArrowUp size={15} /> Vis øverst
                  </button>}
                  <button type="button" disabled={saving || uploading}
                    aria-label={`Fjern billede ${index + 1} fra siden`}
                    onClick={() => setPhotos(current => current.filter((_, i) => i !== index))}
                    className="inline-flex items-center gap-1 text-sm text-red-700 disabled:opacity-50">
                    <Trash2 size={15} /> Fjern fra siden
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
        <h2 className="font-bold text-slate-900 mb-2">Sidens indhold</h2>
        <p className="text-sm text-slate-500 mb-4">
          Skriv teksten til &quot;Om os&quot;-siden. Brug tomme linjer til at adskille afsnit.
        </p>
        <textarea
          disabled={saving || loadError}
          value={content}
          onChange={(e) => { setContent(e.target.value); setContentEdited(true) }}
          rows={20}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none resize-vertical font-sans leading-relaxed"
          placeholder="Skriv om kennelen..."
        />
      </div>
    </div>
  )
}
