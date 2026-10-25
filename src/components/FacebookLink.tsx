import { FACEBOOK_URL } from '@/lib/social'

export default function FacebookLink({ showLabel = false }: { showLabel?: boolean }) {
  return (
    <a
      href={FACEBOOK_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Kennel Team Englund på Facebook (åbner i ny fane)"
      title="Kennel Team Englund på Facebook"
      className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-md px-2 text-blue-50 hover:bg-[#1e3a5f] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 transition-colors"
    >
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
        <path d="M22 12a10 10 0 1 0-11.563 9.878v-6.987H7.898V12h2.539V9.797c0-2.506 1.493-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.772-1.63 1.563V12h2.774l-.444 2.89h-2.33v6.988A10.002 10.002 0 0 0 22 12Z" />
      </svg>
      {showLabel && <span className="text-sm font-medium">Følg os på Facebook</span>}
    </a>
  )
}
