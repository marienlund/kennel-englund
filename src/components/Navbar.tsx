import Link from 'next/link'
import { LogIn } from 'lucide-react'

const links = [
  { href: '/', label: 'Forside' },
  { href: '/avlstaever', label: 'Avlstæver' },
  { href: '/avlshanner', label: 'Avlshanner' },
  { href: '/hvalpe', label: 'Hvalpe' },

  { href: '/resultater', label: 'Resultater' },
  { href: '/nyheder', label: 'Nyheder' },
  { href: '/om-os', label: 'Om os' },
  { href: '/kontakt', label: 'Kontakt' },
]

export default function Navbar() {
  return (
    <nav aria-label="Hovedmenu" className="bg-[#0c2340] text-blue-50 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 py-3">
          <Link href="/" className="order-1 font-bold text-lg sm:text-xl tracking-tight hover:text-blue-200 transition-colors">
            Kennel Team Englund
          </Link>
          <div className="order-3 w-full xl:order-2 xl:w-auto flex flex-wrap items-center justify-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="whitespace-nowrap px-3 py-2 rounded-md text-sm font-medium hover:bg-[#1e3a5f] hover:text-blue-200 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <Link
            href="/login"
            className="order-2 xl:order-3 inline-flex shrink-0 items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            <LogIn size={16} aria-hidden="true" /> Admin
          </Link>
        </div>
      </div>
    </nav>
  )
}
