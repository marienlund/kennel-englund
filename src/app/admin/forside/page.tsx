'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save, Upload, Image as ImageIcon } from 'lucide-react'

interface SiteSettings {
  hero_image_url: string
  hero_title: string
  hero_subtitle: string
  intro_text_1: string
  intro_text_2: string
}

const DEFAULTS: SiteSettings = {
  hero_image_url: '',
  hero_title: 'Kennel Team Englund',
  hero_subtitle: 'Schæferhundeopdræt siden 1984',
  intro_text_1: 'Opdræt af schæferhunde med fokus på mentalitet, sundhed og brugbarhed — siden 1984.',
  intro_text_2: 'Vi avler sunde, mentalt stærke og brugbare schæferhunde. Alle vores hunde er røntgenfotograferet, mentalt beskrevne og uddannede. Vi tror på, at en god schæferhund starter med et godt gemyt.',
}

export default function AdminForsidePage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [noTable, setNoTable] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from('site_settings').select('id, value')
      if (error) throw error

      const loaded: Partial<SiteSettings> = {}
      for (const row of data || []) {
        if (row.id in DEFAULTS) {
          loaded[row.id as keyof SiteSettings] = row.value
        }
      }
      setSettings({ ...DEFAULTS, ...loaded })
    } catch {
      setNoTable(true)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setMessage(null)
    try {
      const supabase = createClient()
      const entries = Object.entries(settings)
      for (const [key, value] of entries) {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ id: key, value, updated_at: new Date().toISOString() })
        if (error) throw error
      }
      setMessage({ type: 'success', text: 'Indstillinger gemt!' })
    } catch {
      setMessage({ type: 'error', text: 'Kunne ikke gemme. Er Supabase konfigureret og SQL kørt?' })
    } finally {
      setSaving(false)
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setMessage(null)
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const fileName = `hero-${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('dog-photos')
        .upload(fileName, file, { upsert: true })
      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('dog-photos')
        .getPublicUrl(fileName)

      setSettings({ ...settings, hero_image_url: urlData.publicUrl })
      setMessage({ type: 'success', text: 'Billede uploadet! Husk at gemme.' })
    } catch {
      setMessage({ type: 'error', text: 'Kunne ikke uploade billede. Tjek at dog-photos bucket eksisterer.' })
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <div className="text-center py-12 text-slate-500">Indlæser...</div>

  const heroPreview = settings.hero_image_url || '/hero.jpg'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Forside</h1>
        <button
          onClick={handleSave}
          disabled={saving || noTable}
          className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
        >
          <Save size={16} /> {saving ? 'Gemmer...' : 'Gem ændringer'}
        </button>
      </div>

      {noTable && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg px-4 py-3 text-sm mb-4">
          ⚠️ Tabellen <code>site_settings</code> findes ikke endnu. Kør SQL-scriptet <code>supabase-site-settings.sql</code> i Supabase SQL Editor først.
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

      <div className="space-y-6">
        {/* Hero image */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <ImageIcon size={18} /> Hero-billede
          </h2>
          <div className="mb-4">
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-slate-100 mb-3">
              <img
                src={heroPreview}
                alt="Hero preview"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="file"
              ref={fileRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading || noTable}
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-700 font-medium px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <Upload size={16} /> {uploading ? 'Uploader...' : 'Upload nyt billede'}
            </button>
          </div>
          {settings.hero_image_url && (
            <div className="text-xs text-slate-400 break-all">
              URL: {settings.hero_image_url}
            </div>
          )}
        </div>

        {/* Text fields */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h2 className="font-bold text-slate-900 mb-4">Tekster</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Titel</label>
              <input
                type="text"
                value={settings.hero_title}
                onChange={(e) => setSettings({ ...settings, hero_title: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                placeholder="Kennel Team Englund"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Undertitel</label>
              <input
                type="text"
                value={settings.hero_subtitle}
                onChange={(e) => setSettings({ ...settings, hero_subtitle: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
                placeholder="Schæferhundeopdræt siden 1984"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Introtekst 1</label>
              <textarea
                value={settings.intro_text_1}
                onChange={(e) => setSettings({ ...settings, intro_text_1: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none resize-vertical"
                placeholder="Kort intro om kennelen..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Introtekst 2</label>
              <textarea
                value={settings.intro_text_2}
                onChange={(e) => setSettings({ ...settings, intro_text_2: e.target.value })}
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none resize-vertical"
                placeholder="Uddybende tekst..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
