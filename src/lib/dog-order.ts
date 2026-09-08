export type DogGender = 'male' | 'female'

export function dogOrderKey(gender: DogGender): string {
  return gender === 'male' ? 'avlshanner_order' : 'avlstaever_order'
}

export function parseDogOrder(value: string | null | undefined): string[] {
  try {
    const parsed: unknown = JSON.parse(value || '[]')
    return Array.isArray(parsed) ? [...new Set(parsed.filter((id): id is string => typeof id === 'string' && id.length > 0))] : []
  } catch {
    return []
  }
}

// Keep saved dogs first; newly added dogs follow in the existing default order.
export function orderDogs<T extends { id: string; name: string; gender: DogGender; sort_order?: number | null }>(dogs: T[], ids: string[]): T[] {
  const positions = new Map(ids.map((id, index) => [id, index]))
  return [...dogs].sort((a, b) => {
    const positionA = positions.get(a.id) ?? Number.MAX_SAFE_INTEGER
    const positionB = positions.get(b.id) ?? Number.MAX_SAFE_INTEGER
    if (positionA !== positionB) return positionA - positionB
    // The female page already used sort_order before manual ordering was added.
    if (a.gender === 'female' && b.gender === 'female') {
      const sortA = a.sort_order ?? Number.MAX_SAFE_INTEGER
      const sortB = b.sort_order ?? Number.MAX_SAFE_INTEGER
      if (sortA !== sortB) return sortA - sortB
    }
    return a.name.localeCompare(b.name, 'da') || a.id.localeCompare(b.id)
  })
}

export function moveDog(ids: string[], id: string, direction: -1 | 1): string[] {
  const index = ids.indexOf(id)
  const next = index + direction
  if (index < 0 || next < 0 || next >= ids.length) return [...ids]
  const moved = [...ids]
  ;[moved[index], moved[next]] = [moved[next], moved[index]]
  return moved
}
