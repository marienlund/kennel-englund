export interface AboutPhoto {
  url: string
  caption: string
}

export const MAX_ABOUT_PHOTOS = 20
export const MAX_ABOUT_PHOTO_BYTES = 10 * 1024 * 1024
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export function validateAboutPhoto(file: { type: string; size: number }): string | null {
  if (!PHOTO_TYPES.includes(file.type)) return 'Vælg et JPG-, PNG-, WebP- eller GIF-billede.'
  if (file.size === 0) return 'Filen er tom.'
  if (file.size > MAX_ABOUT_PHOTO_BYTES) return 'Billedet må højst fylde 10 MB.'
  return null
}

// Settings are stored as text; older sites have no photo setting yet.
export function parseAboutPhotos(value: string | null | undefined): AboutPhoto[] {
  if (!value) return []
  try {
    const parsed: unknown = JSON.parse(value)
    if (!Array.isArray(parsed)) return []
    const photos: AboutPhoto[] = []
    const seen = new Set<string>()
    for (const item of parsed) {
      if (!item || typeof item !== 'object' || typeof item.url !== 'string') continue
      try {
        if (new URL(item.url).protocol !== 'https:') continue
      } catch {
        continue
      }
      if (seen.has(item.url)) continue
      seen.add(item.url)
      photos.push({ url: item.url, caption: typeof item.caption === 'string' ? item.caption.slice(0, 300) : '' })
      if (photos.length === MAX_ABOUT_PHOTOS) break
    }
    return photos
  } catch {
    return []
  }
}
