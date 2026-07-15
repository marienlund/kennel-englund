import { Phone, Mail, MapPin } from 'lucide-react'
import { createServerSupabase } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const DEFAULTS = {
  contact_phone: '+45 2013 7884',
  contact_email: 'team@kennel-englund.dk',
  contact_address: 'Danmark',
  contact_text: 'Har du spørgsmål om vores hunde, hvalpe eller opdræt? Du er altid velkommen til at kontakte os.',
}

async function getContactSettings() {
  try {
    const supabase = await createServerSupabase()
    const { data, error } = await supabase.from('site_settings').select('id, value')
    if (error) throw error

    const settings = { ...DEFAULTS }
    for (const row of data || []) {
      if (row.id in settings) {
        settings[row.id as keyof typeof settings] = row.value
      }
    }
    return settings
  } catch {
    return DEFAULTS
  }
}

export default async function KontaktPage() {
  const settings = await getContactSettings()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">Kontakt os</h1>
      <p className="text-slate-600 mb-10 max-w-2xl">
        {settings.contact_text}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Contact info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
            <h2 className="font-bold text-lg text-slate-900 mb-4">Kontaktoplysninger</h2>
            <div className="space-y-4">
              <a
                href={`tel:${settings.contact_phone.replace(/\s/g, '')}`}
                className="flex items-center gap-3 text-slate-700 hover:text-blue-700 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-blue-700" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Telefon</p>
                  <p className="font-semibold">{settings.contact_phone}</p>
                </div>
              </a>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail size={18} className="text-blue-700" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Email</p>
                  <p className="font-semibold">{settings.contact_email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-blue-700" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">Beliggenhed</p>
                  <p className="font-semibold">{settings.contact_address}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h3 className="font-bold text-[#0c2340] mb-2">Besøg os</h3>
            <p className="text-[#1e3a5f] text-sm leading-relaxed">
              Du er velkommen til at besøge os og se vores hunde. Ring venligst i forvejen 
              så vi kan aftale et tidspunkt der passer.
            </p>
          </div>
        </div>

        {/* Contact form placeholder */}
        <ContactForm />
      </div>
    </div>
  )
}

function ContactForm() {
  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
      <h2 className="font-bold text-lg text-slate-900 mb-4">Send en besked</h2>
      <form className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
            Navn
          </label>
          <input
            type="text"
            id="name"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
            placeholder="Dit navn"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
            placeholder="din@email.dk"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">
            Telefon (valgfrit)
          </label>
          <input
            type="tel"
            id="phone"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none"
            placeholder="+45..."
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
            Besked
          </label>
          <textarea
            id="message"
            rows={4}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none resize-vertical"
            placeholder="Skriv din besked her..."
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
        >
          Send besked
        </button>
        <p className="text-xs text-slate-400 text-center">
          Kontaktformularen er en placeholder — brug venligst telefon eller email.
        </p>
      </form>
    </div>
  )
}
