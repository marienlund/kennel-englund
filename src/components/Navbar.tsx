'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '/', label: 'Forside' },
  { href: '/avlstaever', label: 'Avlstæver' },
  { href: '/avlshanner', label: 'Avlshanner' },
  { href: '/hunde', label: 'Egne Hunde' },
  { href: '/hvalpe', label: 'Hvalpe' },
  { href: '/resultater', label: 'Resultater' },
  { href: '/nyheder', label: 'Nyheder' },
  { href: '/om-os', label: 'Om os' },
  { href: '/kontakt', label: 'Kontakt' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-[#0c2340] text-blue-50 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl tracking-tight hover:text-blue-200 transition-colors">
            🐾 Kennel Team Englund
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex space-x-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#1e3a5f] hover:text-blue-200 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-[#1e3a5f]"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#1a365d]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#1e3a5f] hover:text-blue-200 transition-colors"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
