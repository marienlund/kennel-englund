import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AdminBar from '@/components/AdminBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kennel Team Englund | Schæferhundeopdræt siden 1984',
  description:
    'Kennel Team Englund - Opdræt af schæferhunde med fokus på mentalitet, sundhed og brugbarhed. Beliggende i Danmark.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="da">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <AdminBar />
      </body>
    </html>
  )
}
