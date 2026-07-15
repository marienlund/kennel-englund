'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Save } from 'lucide-react'

const DEFAULT_CONTENT = `Kennel Team Englund blev grundlagt i 1984 med en simpel vision: at opdrætte schæferhunde der er mentalt stærke, sunde og brugbare.

Gennem mere end 40 års erfaring har vi opbygget et solidt avlsprogram baseret på de bedste europæiske blodlinjer. Vi har gennem årene produceret talrige hunde der har udmærket sig både i udstillingsringen og på brugsprøvebanen.

Vi tror på, at en god schæferhund starter med et godt gemyt. Mentalitet er altid vores højeste prioritet i avlsarbejdet. En hund med et stærkt nervesystem, god selvtillid og naturlig kontaktsøgen er fundamentet for alt andet — hvad enten det drejer sig om familieliv, brugsprøver eller udstilling.

Alle vores avlsdyr er mentalt beskrevne, røntgenfotograferet for HD og AD, og OCD-undersøgt. Vi accepterer ingen kompromiser når det gælder sundhed. Vores mål er at producere hunde der er sunde i krop og sind, med et væsen der gør dem til fremragende familiehunde og brugshunde.`

export default function AdminOmOsPage() {
  const [content, setContent] = useState(DEFAULT_CONTENT)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [noTable, setNoTable] = useState(false)

  useEffect(() => {
    loadContent()
  }, [])

  async function loadContent() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('id', 'om_os_content')
        .single()
      if (error) throw error
      if (data?.value) setContent(data.value)
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
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 'om_os_content', value: content, updated_at: new Date().toISOString() })
      if (error) throw error
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
        <h2 className="font-bold text-slate-900 mb-2">Sidens indhold</h2>
        <p className="text-sm text-slate-500 mb-4">
          Skriv teksten til &quot;Om os&quot;-siden. Brug tomme linjer til at adskille afsnit.
        </p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none resize-vertical font-sans leading-relaxed"
          placeholder="Skriv om kennelen..."
        />
      </div>
    </div>
  )
}
