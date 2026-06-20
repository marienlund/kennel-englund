import { Dog, Litter, News } from './types'
import { mockDogs, mockLitters, mockNews } from './mock-data'

// Public data layer: always uses mock data for public-facing pages.
// Admin pages use Supabase directly via client-side calls.
// This ensures the site always shows the correct dogs with photos.

export async function getDogs(): Promise<Dog[]> {
  return mockDogs
}

export async function getFeaturedDogs(): Promise<Dog[]> {
  return mockDogs.filter((d) => d.is_featured)
}

export async function getDog(id: string): Promise<Dog | null> {
  return mockDogs.find((d) => d.id === id) || null
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
