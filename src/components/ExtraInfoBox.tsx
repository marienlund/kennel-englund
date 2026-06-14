'use client'

import { useState } from 'react'
import { ChevronDown, Info } from 'lucide-react'

export default function ExtraInfoBox({ text }: { text: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors min-h-[48px]"
      >
        <span className="flex items-center gap-2">
          <Info size={16} className="text-[#2563eb]" />
          <span className="text-sm font-bold uppercase tracking-wider text-[#0c2340]">
            Øvrige oplysninger
          </span>
        </span>
        <ChevronDown
          size={18}
          className={`text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-slate-100">
          <div className="pt-4 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
            {text.replace(/\\n/g, '\n')}
          </div>
        </div>
      )}
    </div>
  )
}
