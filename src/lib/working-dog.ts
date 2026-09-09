import { mockDogs } from './mock-data'

export function isWorkingDogProfileUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' &&
      (url.hostname === 'working-dog.com' || url.hostname.endsWith('.working-dog.com')) &&
      /^\/dogs-details\/\d+(?:\/|$)/.test(url.pathname) && !url.username && !url.password
  } catch {
    return false
  }
}

function normalizedName(name: string): string {
  return name.normalize('NFC').replace(/[’‘´`]/g, "'").trim().replace(/\s+/g, ' ').toLocaleLowerCase('da')
}

// Only reuse an existing project link for an exact, unambiguous dog match.
// An explicit empty string means the administrator removed the link.
export function getWorkingDogUrl(dog: { name: string; birthdate?: string | null; working_dog_url?: string | null }): string {
  if (dog.working_dog_url != null) return dog.working_dog_url.trim()
  const matches = mockDogs.filter(candidate =>
    normalizedName(candidate.name) === normalizedName(dog.name) &&
    (!dog.birthdate || !candidate.birthdate || dog.birthdate === candidate.birthdate) &&
    candidate.working_dog_url && isWorkingDogProfileUrl(candidate.working_dog_url)
  )
  return matches.length === 1 ? matches[0].working_dog_url! : ''
}
