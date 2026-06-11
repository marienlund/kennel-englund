'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { mockDogs } from '@/lib/mock-data'

const femaleDogs = mockDogs.filter((d) => d.gender === 'female')
const maleDogs = mockDogs.filter((d) => d.gender === 'male')

type DropdownItem = {
  href: string
  label: string
  dropdownType?: 'females' | 'males'
}

const links: DropdownItem[] = [
  { href: '/', label: 'Forside' },
  { href: '/hunde?køn=female', label: 'Avlstæver', dropdownType: 'females' },
  { href: '/hunde?køn=male', label: 'Avlshanner', dropdownType: 'males' },
  { href: '/hunde', label: 'Egne Hunde' },
  { href: '/hvalpe', label: 'Hvalpe' },
  { href: '/resultater', label: 'Resultater' },
  { href: '/nyheder', label: 'Nyheder' },
  { href: '/om-os', label: 'Om os' },
  { href: '/kontakt', label: 'Kontakt' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [mobileOpenDropdown, setMobileOpenDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function getDogsForDropdown(type: 'females' | 'males') {
    return type === 'females' ? femaleDogs : maleDogs
  }

  function toggleDropdown(type: string) {
    setOpenDropdown(openDropdown === type ? null : type)
  }

  function toggleMobileDropdown(type: string) {
    setMobileOpenDropdown(mobileOpenDropdown === type ? null : type)
  }

  return (
    <nav className="bg-[#0c2340] text-blue-50 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl tracking-tight hover:text-blue-200 transition-colors">
            🐾 Kennel Team Englund
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex space-x-1" ref={dropdownRef}>
            {links.map((l) =>
              l.dropdownType ? (
                <div key={l.label} className="relative">
                  <button
                    onClick={() => toggleDropdown(l.dropdownType!)}
                    className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium hover:bg-[#1e3a5f] hover:text-blue-200 transition-colors"
                  >
                    {l.label}
                    <ChevronDown size={14} className={`transition-transform ${openDropdown === l.dropdownType ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === l.dropdownType && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
                      <Link
                        href={l.href}
                        className="block px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-blue-50 transition-colors"
                        onClick={() => setOpenDropdown(null)}
                      >
                        Se alle {l.dropdownType === 'females' ? 'avlstæver' : 'avlshanner'}
                      </Link>
                      <div className="border-t border-slate-100 my-1" />
                      {getDogsForDropdown(l.dropdownType).map((dog) => (
                        <Link
                          key={dog.id}
                          href={`/hunde/${dog.id}`}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {dog.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#1e3a5f] hover:text-blue-200 transition-colors"
                >
                  {l.label}
                </Link>
              )
            )}
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
            {links.map((l) =>
              l.dropdownType ? (
                <div key={l.label}>
                  <button
                    onClick={() => toggleMobileDropdown(l.dropdownType!)}
                    className="flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium hover:bg-[#1e3a5f] hover:text-blue-200 transition-colors"
                  >
                    {l.label}
                    <ChevronDown size={18} className={`transition-transform ${mobileOpenDropdown === l.dropdownType ? 'rotate-180' : ''}`} />
                  </button>
                  {mobileOpenDropdown === l.dropdownType && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-[#1a365d] pl-3">
                      {getDogsForDropdown(l.dropdownType).map((dog) => (
                        <Link
                          key={dog.id}
                          href={`/hunde/${dog.id}`}
                          className="block px-3 py-1.5 rounded-md text-sm text-blue-200/80 hover:bg-[#1e3a5f] hover:text-blue-100 transition-colors"
                          onClick={() => { setOpen(false); setMobileOpenDropdown(null) }}
                        >
                          {dog.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-[#1e3a5f] hover:text-blue-200 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
