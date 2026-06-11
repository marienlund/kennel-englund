import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0c2340] text-blue-100/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-blue-50 font-bold text-lg mb-3">Kennel Team Englund</h3>
            <p className="text-sm leading-relaxed">
              Opdræt af schæferhunde med fokus på mentalitet, sundhed og brugbarhed siden 1984.
            </p>
          </div>
          <div>
            <h3 className="text-blue-50 font-bold text-lg mb-3">Sider</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/hunde" className="hover:text-blue-200 transition-colors">Vores hunde</Link></li>
              <li><Link href="/hvalpe" className="hover:text-blue-200 transition-colors">Hvalpe</Link></li>
              <li><Link href="/om-os" className="hover:text-blue-200 transition-colors">Om os</Link></li>
              <li><Link href="/kontakt" className="hover:text-blue-200 transition-colors">Kontakt</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-blue-50 font-bold text-lg mb-3">Kontakt</h3>
            <ul className="space-y-2 text-sm">
              <li>📞 <a href="tel:+4520137884" className="hover:text-blue-200 transition-colors">+45 2013 7884</a></li>
              <li>📍 Danmark</li>
            </ul>
          </div>
        </div>

        {/* DKK Badge */}
        <div className="flex justify-center my-10">
          <div className="relative w-32 h-32">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full bg-red-700 shadow-lg" />
            {/* Inner ring border */}
            <div className="absolute inset-1.5 rounded-full border-2 border-red-300/60" />
            {/* Inner circle */}
            <div className="absolute inset-3 rounded-full bg-red-800 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold text-red-100 uppercase tracking-widest leading-tight">Dansk</span>
              <span className="text-[10px] font-bold text-red-100 uppercase tracking-widest leading-tight">Kennel Klub</span>
              <div className="w-8 h-px bg-red-300/50 my-1" />
              <span className="text-[9px] font-semibold text-red-200 uppercase tracking-wider">Registreret</span>
              <span className="text-[9px] font-semibold text-red-200 uppercase tracking-wider">Opdræt</span>
            </div>
            {/* Decorative stars */}
            <span className="absolute top-0.5 left-1/2 -translate-x-1/2 text-red-200 text-[8px]">★ ★ ★</span>
            <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-red-200 text-[8px]">★ ★ ★</span>
          </div>
        </div>

        <div className="border-t border-[#1a365d] mt-4 pt-6 text-center text-xs text-blue-100/50">
          © {new Date().getFullYear()} Kennel Team Englund. Alle rettigheder forbeholdes.
        </div>
      </div>
    </footer>
  )
}
