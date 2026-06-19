import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0c2340] text-blue-100/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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
              <li><Link href="/resultater" className="hover:text-blue-200 transition-colors">Resultater</Link></li>
              <li><Link href="/nyheder" className="hover:text-blue-200 transition-colors">Nyheder</Link></li>
              <li><Link href="/om-os" className="hover:text-blue-200 transition-colors">Om os</Link></li>
              <li><Link href="/kontakt" className="hover:text-blue-200 transition-colors">Kontakt</Link></li>
            </ul>
          </div>
          <div className="flex items-center justify-start md:justify-start">
            <img src="/logo.jpg" alt="Team Englund Working Dogs" className="w-44 h-auto rounded-lg shadow-lg" />
          </div>
          <div>
            <h3 className="text-blue-50 font-bold text-lg mb-3">Kontakt</h3>
            <ul className="space-y-2 text-sm">
              <li>📞 <a href="tel:+4520137884" className="hover:text-blue-200 transition-colors">+45 2013 7884</a></li>
              <li>📍 Danmark</li>
            </ul>
          </div>
        </div>

        {/* DKK Opdrætteruddannelse + Udtagelse */}
        <div className="mt-12 border-t border-[#1a365d] pt-10">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* DKK Logo */}
            <div className="flex-shrink-0">
              <img
                src="/dkk-badge.jpg"
                alt="HAR GENNEMGÅET DKKs OPDRÆTTERUDDANNELSE"
                className="w-32 h-32 rounded-full object-cover shadow-lg"
              />
            </div>

            {/* DKK Udtagelse */}
            <div className="text-center md:text-left">
              <h3 className="text-blue-50 font-bold text-lg mb-3">DKK Udtagelse</h3>
              <p className="text-sm leading-relaxed text-blue-100/80 italic">
                &ldquo;Særdeles pæne forhold. Pæne kasser og bokse. Der er rent og ryddeligt. 
                Gode ude- og luftearealer. Alle hunde er motiveret, venlige og imødekommende.&rdquo;
              </p>
              <p className="text-xs text-blue-100/50 mt-2">— Dansk Kennel Klub, efter besøg i vores kennel</p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#1a365d] mt-10 pt-6 text-center text-xs text-blue-100/50">
          © {new Date().getFullYear()} Kennel Team Englund. Alle rettigheder forbeholdes.
        </div>
      </div>
    </footer>
  )
}
