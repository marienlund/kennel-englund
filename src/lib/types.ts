export interface Dog {
  id: string
  name: string
  gender: 'male' | 'female'
  birthdate: string | null
  sire_name: string | null
  dam_name: string | null
  hd_score: string | null
  ad_score: string | null
  ocd_status: string | null
  mental_description: string | null
  training_results: string | null
  achievements: string | null
  photo_url?: string | null
  is_featured: boolean
  created_at: string
  updated_at: string
  dog_photos?: DogPhoto[]
}

export interface DogPhoto {
  id: string
  dog_id: string
  storage_path: string
  caption: string | null
  sort_order: number
  created_at: string
}

export interface Litter {
  id: string
  sire_name: string
  dam_name: string
  birth_date: string | null
  males_count: number
  females_count: number
  available: boolean
  description: string | null
  created_at: string
  litter_photos?: LitterPhoto[]
}

export interface LitterPhoto {
  id: string
  litter_id: string
  storage_path: string
  caption: string | null
  sort_order: number
  created_at: string
}

export interface News {
  id: string
  title: string
  content: string
  photo_path: string | null
  published_at: string
  created_at: string
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: 'admin' | 'visitor'
  created_at: string
}
