import { Dog, Litter, News } from './types'
import { createClient } from '@supabase/supabase-js'
import { mockDogs, mockLitters, mockNews } from './mock-data'

// Legacy lists retain their fallback data. Dog details resolve the live
// database IDs used by the breeding dog pages before checking legacy links.

export async function getDogs(): Promise<Dog[]> {
  return mockDogs
}

export async function getFeaturedDogs(): Promise<Dog[]> {
  return mockDogs.filter((d) => d.is_featured)
}

export async function getDog(id: string): Promise<Dog | null> {
  const fallback = mockDogs.find((dog) => dog.id === id) || null
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return fallback

  // Invalid IDs are missing pages, not database query errors.
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null

  const supabase = createClient(url, key)
  const { data, error } = await supabase.from('dogs').select('*').eq('id', id).maybeSingle()
  // Do not misreport a temporary database failure as a missing dog.
  if (error) throw new Error('Kunne ikke hente hundens oplysninger. Prøv igen om lidt.')
  return (data as Dog | null) ?? fallback
}

export async function getLitters(): Promise<Litter[]> {
  return mockLitters
}

export async function getNews(): Promise<News[]> {
  return mockNews
}

export async function getLatestNews(limit = 3): Promise<News[]> {
  return mockNews.slice(0, limit)
}
