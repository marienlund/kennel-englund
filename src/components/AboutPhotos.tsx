import type { AboutPhoto } from '@/lib/about-photos'

export default function AboutPhotos({ photos }: { photos: AboutPhoto[] }) {
  if (!photos.length) {
    return (
      <div className="aspect-[16/7] bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mb-10">
        <span className="text-7xl opacity-40" aria-hidden="true">🏡</span>
      </div>
    )
  }

  return (
    <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-5">
      {photos.map((photo, index) => (
        <figure key={photo.url} className={index === 0 ? 'sm:col-span-2 min-w-0' : 'min-w-0'}>
          {/* Uploaded images retain their proportions, including portrait photos. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={photo.url} alt={photo.caption || `Kennel Team Englund – billede ${index + 1}`}
            loading={index === 0 ? 'eager' : 'lazy'}
            className={`w-full rounded-2xl bg-slate-50 object-contain ${index === 0 ? 'max-h-[36rem]' : 'h-64'}`} />
          {photo.caption && <figcaption className="text-sm text-slate-500 mt-2 break-words">{photo.caption}</figcaption>}
        </figure>
      ))}
    </div>
  )
}
