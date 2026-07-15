'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save } from 'lucide-react'

interface ContactSettings {
  contact_phone: string
  contact_email: string
  contact_address: string
  contact_text: string
}

const DEFAULTS: ContactSettings = {
  contact_phone: '+45 2013 7884',
  contact_email: 'team@kennel-englund.dk',
  contact_address: 'Danmark',
  contact_text: 'Har du spørgsmål om vores hunde, hvalpe eller opdræt? Du er altid velkommen til at kontakte os.',
}

export default function AdminKontaktPage() {
  const [settings, setSettings] = useState<ContactSettings>(DEFAULTS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [noTable, setNoTable] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from('site_settings').select('id, value')
      if (error) throw error

      const loaded: Partial<ContactSettings> = {}
      for (const row of data || []) {
        if (row.id in DEFAULTS) {
          loaded[row.id as keyof ContactSettings] = row.value
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
      for (const [key, value] of Object.entries(settings)) {
        const { error } = await supabase
          .from('site_settings')
          .upsert({ id: key, value, updated_at: new Date().toISOString() })
        if (error) throw error
      }
      setMessage({ type: 'success', text: 'Kontaktoplysninger gemt!' })
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
        <h1 className="text-2xl font-bold text-slate-900">Kontakt</h1>
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
          ⚠️ Tabellen <code>site_settings</code> findes ikke endnu. Kør SQL-scriptet først.
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

      <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
        <h2 className="font-bold text-slate-900 mb-4">Kontaktoplysninger</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
            <input
              type="text"
              value={settings.contact_phone}
              onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              placeholder="+45 2013 7884"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              value={settings.contact_email}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              placeholder="team@kennel-englund.dk"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Adresse / Beliggenhed</label>
            <input
              type="text"
              value={settings.contact_address}
              onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
              placeholder="Danmark"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Intro-tekst</label>
            <textarea
              value={settings.contact_text}
              onChange={(e) => setSettings({ ...settings, contact_text: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none resize-vertical"
              placeholder="Har du spørgsmål..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
