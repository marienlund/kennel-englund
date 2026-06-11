'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { News } from '@/lib/types'
import { mockNews } from '@/lib/mock-data'
import { Plus, Trash2, Save, X } from 'lucide-react'

export default function AdminNyhederPage() {
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)
  const [useMock, setUseMock] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: '',
    content: '',
    published_at: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    loadNews()
  }, [])

  async function loadNews() {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from('news').select('*').order('published_at', { ascending: false })
      if (error) throw error
      setNews(data as News[])
    } catch {
      setUseMock(true)
      setNews(mockNews)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from('news').insert({
        title: form.title,
        content: form.content,
        published_at: form.published_at,
      })
      if (error) throw error
      setShowForm(false)
      setForm({ title: '', content: '', published_at: new Date().toISOString().split('T')[0] })
      loadNews()
    } catch {
      alert('Kunne ikke gemme. Er Supabase konfigureret?')
    } finally {
      setSaving(false)
    }
  }

  async function deleteNews(id: string) {
    if (!confirm('Er du sikker?')) return
    if (useMock) {
      setNews(news.filter((n) => n.id !== id))
      return
    }
    const supabase = createClient()
    await supabase.from('news').delete().eq('id', id)
    setNews(news.filter((n) => n.id !== id))
  }

  if (loading) return <div className="text-center py-12 text-slate-500">Indlæser...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Nyheder</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
        >
          {showForm ? <><X size={16} /> Annuller</> : <><Plus size={16} /> Ny nyhed</>}
        </button>
      </div>

      {useMock && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg px-4 py-3 text-sm mb-4">
          ⚠️ Supabase er ikke konfigureret — viser mock data.
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-6">
          <h2 className="font-bold text-slate-900 mb-4">Ny nyhed</h2>
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Titel *</label>
              <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Dato</label>
              <input type="date" value={form.published_at} onChange={(e) => setForm({ ...form, published_at: e.target.value })} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none max-w-xs" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Indhold *</label>
              <textarea required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none resize-vertical" />
            </div>
          </div>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
            <Save size={16} /> {saving ? 'Gemmer...' : 'Publicer'}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {news.map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <time className="text-xs font-medium text-blue-700 uppercase tracking-wide">
                  {new Date(item.published_at).toLocaleDateString('da-DK', { year: 'numeric', month: 'long', day: 'numeric' })}
                </time>
                <h3 className="font-bold text-slate-900 mt-1">{item.title}</h3>
                <p className="text-sm text-slate-600 mt-2 line-clamp-2">{item.content}</p>
              </div>
              <button onClick={() => deleteNews(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors ml-4 flex-shrink-0" title="Slet">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {news.length === 0 && (
          <div className="text-center py-8 text-slate-400">Ingen nyheder endnu.</div>
        )}
      </div>
    </div>
  )
}
