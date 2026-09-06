'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Pencil, X, LayoutDashboard } from 'lucide-react'

const pageToAdmin: Record<string, { href: string; label: string }> = {
  '/': { href: '/admin/forside', label: 'Rediger Forside' },
  '/avlstaever': { href: '/admin/hunde', label: 'Rediger Hunde' },
  '/avlshanner': { href: '/admin/hunde', label: 'Rediger Hunde' },
  '/hvalpe': { href: '/admin/hvalpe', label: 'Rediger Hvalpe' },
  '/resultater': { href: '/admin/resultater', label: 'Rediger Resultater' },
  '/nyheder': { href: '/admin/nyheder', label: 'Rediger Nyheder' },
  '/om-os': { href: '/admin/om-os', label: 'Rediger Om Os' },
  '/kontakt': { href: '/admin/kontakt', label: 'Rediger Kontakt' },
}

const allAdminPages = [
  { href: '/admin/forside', label: 'Forside', icon: '🏠' },
  { href: '/admin/hunde', label: 'Hunde', icon: '🐕' },
  { href: '/admin/hvalpe', label: 'Hvalpe', icon: '🐾' },
  { href: '/admin/nyheder', label: 'Nyheder', icon: '📰' },
  { href: '/admin/resultater', label: 'Resultater', icon: '🏆' },
  { href: '/admin/om-os', label: 'Om os', icon: 'ℹ️' },
  { href: '/admin/kontakt', label: 'Kontakt', icon: '📞' },
]

export default function AdminBar() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [minimized, setMinimized] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Don't show on admin pages
    if (pathname.startsWith('/admin') || pathname === '/login') return

    async function checkAdmin() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile?.role === 'admin') {
          setIsAdmin(true)
        }
      } catch {}
    }

    checkAdmin()
  }, [pathname])

  // Don't render on admin pages or if not admin
  if (!isAdmin || pathname.startsWith('/admin') || pathname === '/login') return null

  const currentPageAdmin = pageToAdmin[pathname]

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-4 right-4 z-50 bg-blue-700 text-white p-3 rounded-full shadow-lg hover:bg-blue-800 transition-colors"
        title="Åbn admin-bar"
      >
        <Pencil size={20} />
      </button>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0c2340] text-white border-t-2 border-blue-500 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        {/* Left: Current page edit */}
        <div className="flex items-center gap-3">
          <LayoutDashboard size={18} className="text-blue-300" />
          <span className="text-sm font-medium text-blue-200">Admin</span>
          
          {currentPageAdmin && (
            <Link
              href={currentPageAdmin.href}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
            >
              <Pencil size={14} />
              {currentPageAdmin.label}
            </Link>
          )}
        </div>

        {/* Center: Quick links dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="inline-flex items-center gap-2 text-sm text-blue-200 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
          >
            Alle admin-sider ▾
          </button>

          {showMenu && (
            <div className="absolute bottom-full mb-2 right-0 bg-[#1e3a5f] border border-blue-400/30 rounded-xl shadow-2xl p-2 min-w-[200px]">
              {allAdminPages.map(page => (
                <Link
                  key={page.href}
                  href={page.href}
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-blue-100 hover:bg-blue-600/50 rounded-lg transition-colors"
                >
                  <span>{page.icon}</span>
                  {page.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right: Minimize */}
        <button
          onClick={() => setMinimized(true)}
          className="text-blue-300 hover:text-white transition-colors p-1"
          title="Minimér"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
