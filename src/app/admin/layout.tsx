'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Dog, Baby, Newspaper, LogOut, Home, LayoutDashboard } from 'lucide-react'

const adminLinks = [
  { href: '/admin/forside', label: 'Forside', icon: LayoutDashboard },
  { href: '/admin/hunde', label: 'Hunde', icon: Dog },
  { href: '/admin/hvalpe', label: 'Hvalpe', icon: Baby },
  { href: '/admin/nyheder', label: 'Nyheder', icon: Newspaper },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-[80vh]">
      {/* Admin top bar */}
      <div className="bg-[#0c2340] text-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-blue-300 mr-3 hidden sm:block">ADMIN</span>
              {adminLinks.map((link) => {
                const Icon = link.icon
                const active = pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      active
                        ? 'bg-[#1e3a5f] text-white'
                        : 'text-blue-300 hover:text-blue-100 hover:bg-[#1e3a5f]'
                    }`}
                  >
                    <Icon size={15} />
                    {link.label}
                  </Link>
                )
              })}
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="flex items-center gap-1 text-blue-300 hover:text-blue-100 text-sm px-2 py-1 rounded hover:bg-[#1e3a5f] transition-colors"
              >
                <Home size={14} /> Site
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-blue-300 hover:text-red-400 text-sm px-2 py-1 rounded hover:bg-[#1e3a5f] transition-colors"
              >
                <LogOut size={14} /> Log ud
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
    </div>
  )
}
