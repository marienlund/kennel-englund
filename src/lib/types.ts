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
  working_dog_url?: string | null
  extra_info?: string | null
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

export interface Puppy {
  name: string
  photo_url?: string | null
  working_dog_url?: string | null
}

export interface Litter {
  id: string
  title?: string | null
  sire_name: string
  dam_name: string
  sire_photo_url?: string | null
  dam_photo_url?: string | null
  sire_working_dog_url?: string | null
  dam_working_dog_url?: string | null
  sire_hd?: string | null
  sire_ad?: string | null
  sire_ocd?: string | null
  sire_training?: string | null
  dam_hd?: string | null
  dam_ad?: string | null
  dam_ocd?: string | null
  dam_training?: string | null
  birth_date: string | null
  males_count: number
  females_count: number
  available: boolean
  description: string | null
  sort_order?: number | null
  males?: Puppy[]
  females?: Puppy[]
  created_at: string
  litter_photos?: LitterPhoto[]
  litter_extra_photos?: LitterExtraPhoto[]
}

export interface LitterPhoto {
  id: string
  litter_id: string
  storage_path: string
  caption: string | null
  sort_order: number
  created_at: string
}

export interface LitterExtraPhoto {
  id: string
  litter_id: string
  parent_type: 'sire' | 'dam'
  photo_url: string
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
