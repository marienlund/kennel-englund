import { Dog, Litter, News } from './types'
import { mockDogs, mockLitters, mockNews } from './mock-data'

// Data layer: uses mock data when Supabase is not configured,
// otherwise fetches from Supabase. This lets the site work
// out of the box without a database.

const isSupabaseConfigured = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  return url && !url.includes('your-project')
}

async function getSupabase() {
  if (!isSupabaseConfigured()) return null
  const { createServerSupabase } = await import('./supabase/server')
  return createServerSupabase()
}

export async function getDogs(): Promise<Dog[]> {
  const supabase = await getSupabase()
  if (!supabase) return mockDogs

  const { data } = await supabase
    .from('dogs')
    .select('*, dog_photos(*)')
    .order('name')
  return (data as Dog[]) || []
}

export async function getFeaturedDogs(): Promise<Dog[]> {
  const supabase = await getSupabase()
  if (!supabase) return mockDogs.filter((d) => d.is_featured)

  const { data } = await supabase
    .from('dogs')
    .select('*, dog_photos(*)')
    .eq('is_featured', true)
    .order('name')
  return (data as Dog[]) || []
}

export async function getDog(id: string): Promise<Dog | null> {
  const supabase = await getSupabase()
  if (!supabase) return mockDogs.find((d) => d.id === id) || null

  const { data } = await supabase
    .from('dogs')
    .select('*, dog_photos(*)')
    .eq('id', id)
    .single()
  return data as Dog | null
}

export async function getLitters(): Promise<Litter[]> {
  const supabase = await getSupabase()
  if (!supabase) return mockLitters

  const { data } = await supabase
    .from('litters')
    .select('*, litter_photos(*)')
    .order('created_at', { ascending: false })
  return (data as Litter[]) || []
}

export async function getNews(): Promise<News[]> {
  const supabase = await getSupabase()
  if (!supabase) return mockNews

  const { data } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false })
  return (data as News[]) || []
}

export async function getLatestNews(limit = 3): Promise<News[]> {
  const supabase = await getSupabase()
  if (!supabase) return mockNews.slice(0, limit)

  const { data } = await supabase
    .from('news')
    .select('*')
    .order('published_at', { ascending: false })
    .limit(limit)
  return (data as News[]) || []
}
