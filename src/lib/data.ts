import { Dog, Litter, News } from './types'
import { createClient } from '@supabase/supabase-js'
import { getWorkingDogUrl } from './working-dog'
import { mockDogs, mockLitters } from './mock-data'

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
  const dog = (data as Dog | null) ?? fallback
  return dog ? { ...dog, working_dog_url: getWorkingDogUrl(dog) } : null
}

export async function getLitters(): Promise<Litter[]> {
  return mockLitters
}

// Public pages read the same records as the news editor, without a cached copy.
async function queryNews(limit?: number): Promise<News[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return []

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }),
    },
  })
  let query = supabase.from('news').select('*').order('published_at', { ascending: false })
  if (limit !== undefined) query = query.limit(limit)
  const { data, error } = await query
  if (error) throw new Error('Kunne ikke hente nyheder. Prøv igen om lidt.')
  return (data ?? []) as News[]
}

export async function getNews(): Promise<News[]> {
  return queryNews()
}

export async function getLatestNews(limit = 3): Promise<News[]> {
  if (limit <= 0) return []
  return queryNews(limit)
}
