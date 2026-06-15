'use client'

import Link from 'next/link'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { mockDogs } from '@/lib/mock-data'

const femaleDogs = mockDogs.filter((d) => d.gender === 'female')
const maleDogs = mockDogs.filter((d) => d.gender === 'male')

// Extra dogs from the original kennelenglund.dk site (not yet in mock data)
const extraFemales: { name: string }[] = []

const extraMales = [
  { name: "Alonso vom Verbotenen Wald" },
  { name: "Aldo Mersak" },
  { name: "CZ Nirreterrit" },
  { name: "Coast Strikers Alvin" },
  { name: "Audi Catario Mikels" },
  { name: "Nederholm's Quik" },
  { name: "Hasco z Lomeckeho Polesi" },
  { name: "Team Englund's Jack" },
  { name: "Irck de la Hutte du Berger" },
  { name: "Bayogi Eika" },
  { name: "Toftegården Nero" },
  { name: "Sund Hund Yang" },
  { name: "Amager's Urban" },
  { name: "Jen-Ager's Odin" },
  { name: "Coudy z Udoli Upy" },
  { name: "Hulgård's Yupp" },
  { name: "Gerry aus der Zigeunerkuhle" },
  { name: "ChaDe's Atos" },
]

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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

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

  function getExtrasForDropdown(type: 'females' | 'males') {
    return type === 'females' ? extraFemales : extraMales
  }

  const handleMouseEnter = useCallback((type: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpenDropdown(type)
  }, [])

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null)
    }, 150)
  }, [])

  function toggleMobileDropdown(type: string) {
    setMobileOpenDropdown(mobileOpenDropdown === type ? null : type)
  }

  return (
    <nav className="bg-[#0c2340] text-blue-50 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-bold text-xl tracking-tight hover:text-blue-200 transition-colors">
            🐾 Kennel Team Englund
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-0.5" ref={dropdownRef}>
            {links.map((l) =>
              l.dropdownType ? (
                <div
                  key={l.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(l.dropdownType!)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      openDropdown === l.dropdownType
                        ? 'bg-[#1e3a5f] text-white'
                        : 'hover:bg-[#1e3a5f]/70 hover:text-blue-200'
                    }`}
                  >
                    {l.label}
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${openDropdown === l.dropdownType ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {/* Dropdown panel */}
                  <div
                    className={`absolute top-full left-0 pt-2 z-50 transition-all duration-200 origin-top ${
                      openDropdown === l.dropdownType
                        ? 'opacity-100 scale-y-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 scale-y-95 -translate-y-1 pointer-events-none'
                    }`}
                  >
                    <div className="w-72 bg-white rounded-xl shadow-2xl border border-slate-200/80 overflow-hidden">
                      {/* Header */}
                      <div className="px-5 py-3 bg-gradient-to-r from-[#0c2340] to-[#1e3a5f]">
                        <Link
                          href={l.href}
                          className="text-sm font-semibold text-white hover:text-blue-200 transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          Se alle {l.dropdownType === 'females' ? 'avlstæver' : 'avlshanner'} →
                        </Link>
                      </div>

                      {/* Dogs with detail pages */}
                      <div className="py-2">
                        {getDogsForDropdown(l.dropdownType).map((dog) => (
                          <Link
                            key={dog.id}
                            href={`/hunde/${dog.id}`}
                            className="flex items-center gap-3 px-5 py-2.5 text-sm text-slate-700 hover:bg-[#0c2340]/5 hover:text-[#0c2340] transition-colors group"
                            onClick={() => setOpenDropdown(null)}
                          >
                            <span className="w-2 h-2 rounded-full bg-[#2563eb] group-hover:scale-125 transition-transform flex-shrink-0" />
                            <span className="font-medium">{dog.name}</span>
                          </Link>
                        ))}
                      </div>

                      {/* Separator */}
                      {getExtrasForDropdown(l.dropdownType).length > 0 && (
                        <>
                          <div className="mx-4 border-t border-slate-200" />
                          <div className="px-5 pt-2.5 pb-1">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                              Øvrige hunde
                            </span>
                          </div>
                          <div className="pb-3">
                            {getExtrasForDropdown(l.dropdownType).map((dog) => (
                              <div
                                key={dog.name}
                                className="flex items-center gap-3 px-5 py-1.5 text-sm text-slate-400"
                              >
                                <span className="w-2 h-2 rounded-full bg-slate-200 flex-shrink-0" />
                                <span>{dog.name}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-[#1e3a5f]/70 hover:text-blue-200 transition-colors"
                >
                  {l.label}
                </Link>
              )
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-[#1e3a5f] transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden border-t border-[#1a365d] overflow-hidden transition-all duration-300 ease-in-out ${
          open ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {links.map((l) =>
            l.dropdownType ? (
              <div key={l.label}>
                <button
                  onClick={() => toggleMobileDropdown(l.dropdownType!)}
                  className="flex items-center justify-between w-full px-3 py-2.5 rounded-md text-base font-medium hover:bg-[#1e3a5f] transition-colors"
                >
                  {l.label}
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-200 ${mobileOpenDropdown === l.dropdownType ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ease-in-out ${
                    mobileOpenDropdown === l.dropdownType ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="ml-3 mt-1 mb-2 border-l-2 border-[#2563eb]/40 pl-3 space-y-0.5">
                    <Link
                      href={l.href}
                      className="block px-3 py-2 rounded-md text-sm font-semibold text-blue-300 hover:bg-[#1e3a5f] transition-colors"
                      onClick={() => { setOpen(false); setMobileOpenDropdown(null) }}
                    >
                      Se alle →
                    </Link>
                    {getDogsForDropdown(l.dropdownType).map((dog) => (
                      <Link
                        key={dog.id}
                        href={`/hunde/${dog.id}`}
                        className="block px-3 py-2 rounded-md text-sm text-blue-200/80 hover:bg-[#1e3a5f] hover:text-blue-100 transition-colors"
                        onClick={() => { setOpen(false); setMobileOpenDropdown(null) }}
                      >
                        {dog.name}
                      </Link>
                    ))}
                    {getExtrasForDropdown(l.dropdownType).length > 0 && (
                      <>
                        <div className="border-t border-[#1a365d]/60 my-1.5 mx-3" />
                        {getExtrasForDropdown(l.dropdownType).map((dog) => (
                          <span
                            key={dog.name}
                            className="block px-3 py-1.5 rounded-md text-sm text-blue-200/35"
                          >
                            {dog.name}
                          </span>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={l.href}
                href={l.href}
                className="block px-3 py-2.5 rounded-md text-base font-medium hover:bg-[#1e3a5f] hover:text-blue-200 transition-colors"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  )
}
