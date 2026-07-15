import type { Metadata } from 'next'
import { Heart, Shield, Award, Clock } from 'lucide-react'
import { createServerSupabase } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Om os | Kennel Team Englund',
  description: 'Lær mere om Kennel Team Englund - schæferhundeopdræt siden 1984.',
}

const DEFAULT_CONTENT = `Kennel Team Englund blev grundlagt i 1984 med en simpel vision: at opdrætte schæferhunde der er mentalt stærke, sunde og brugbare.

Gennem mere end 40 års erfaring har vi opbygget et solidt avlsprogram baseret på de bedste europæiske blodlinjer. Vi har gennem årene produceret talrige hunde der har udmærket sig både i udstillingsringen og på brugsprøvebanen.

Vi tror på, at en god schæferhund starter med et godt gemyt. Mentalitet er altid vores højeste prioritet i avlsarbejdet. En hund med et stærkt nervesystem, god selvtillid og naturlig kontaktsøgen er fundamentet for alt andet — hvad enten det drejer sig om familieliv, brugsprøver eller udstilling.

Alle vores avlsdyr er mentalt beskrevne, røntgenfotograferet for HD og AD, og OCD-undersøgt. Vi accepterer ingen kompromiser når det gælder sundhed. Vores mål er at producere hunde der er sunde i krop og sind, med et væsen der gør dem til fremragende familiehunde og brugshunde.`

async function getOmOsContent(): Promise<string | null> {
  try {
    const supabase = await createServerSupabase()
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('id', 'om_os_content')
      .single()
    if (error) throw error
    return data?.value || null
  } catch {
    return null
  }
}

export default async function OmOsPage() {
  const customContent = await getOmOsContent()
  const hasCustomContent = customContent && customContent.trim().length > 0

  // If custom content from admin, render it as paragraphs
  if (hasCustomContent) {
    const paragraphs = customContent.split('\n\n').filter((p: string) => p.trim())
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">Om Kennel Team Englund</h1>
        <div className="aspect-[16/7] bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mb-10">
          <span className="text-7xl opacity-40">🏡</span>
        </div>
        <div className="prose prose-slate max-w-none">
          {paragraphs.map((p: string, i: number) => (
            <p key={i} className="text-slate-600 leading-relaxed mb-4">{p}</p>
          ))}
        </div>
      </div>
    )
  }

  // Default hardcoded layout
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">Om Kennel Team Englund</h1>

      <div className="aspect-[16/7] bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mb-10">
        <span className="text-7xl opacity-40">🏡</span>
      </div>

      <div className="prose prose-slate max-w-none">
        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock size={20} className="text-blue-700" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 m-0">Vores historie</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Kennel Team Englund blev grundlagt i 1984 med en simpel vision: at opdrætte schæferhunde 
              der er mentalt stærke, sunde og brugbare. Gennem mere end 40 års erfaring har vi opbygget 
              et solidt avlsprogram baseret på de bedste europæiske blodlinjer. Vi har gennem årene 
              produceret talrige hunde der har udmærket sig både i udstillingsringen og på brugsprøvebanen.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Heart size={20} className="text-blue-700" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 m-0">Vores filosofi</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Vi tror på, at en god schæferhund starter med et godt gemyt. Mentalitet er altid vores 
              højeste prioritet i avlsarbejdet. En hund med et stærkt nervesystem, god selvtillid og 
              naturlig kontaktsøgen er fundamentet for alt andet — hvad enten det drejer sig om familieliv, 
              brugsprøver eller udstilling.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Alle vores avlsdyr er mentalt beskrevne, røntgenfotograferet for HD og AD, og OCD-undersøgt. 
              Vi accepterer ingen kompromiser når det gælder sundhed. Vores mål er at producere hunde der 
              er sunde i krop og sind, med et væsen der gør dem til fremragende familiehunde og brugshunde.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield size={20} className="text-blue-700" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 m-0">Sundhed</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Sundhed er en hjørnesten i vores avlsprogram. Vi bruger kun hunde der er:
            </p>
            <ul className="text-slate-600 space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                HD-røntgenfotograferet (vi tilstræber HD-A/B)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                AD-røntgenfotograferet (albuer)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                OCD-undersøgt
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                Mentalt beskrevne med godkendt resultat
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">✓</span>
                Avlskårede (KKL)
              </li>
            </ul>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Award size={20} className="text-blue-700" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 m-0">Resultater</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Gennem årene har vores hunde opnået bemærkelsesværdige resultater, herunder:
            </p>
            <ul className="text-slate-600 space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">🏆</span>
                VA-placeringer på Bundessieger
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">🏆</span>
                Landsmester i spordisciplin
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">🏆</span>
                Talrige V1-placeringer på specialudstillinger
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">🏆</span>
                IPO3-hunde med topresultater
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
