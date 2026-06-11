# Kennel Team Englund 🐾

Professionel hjemmeside for Kennel Team Englund — schæferhundeopdræt siden 1984.

## Tech Stack

- **Next.js 15** (App Router) + TypeScript
- **Tailwind CSS v4** for styling
- **Supabase** for auth, database, og storage
- **Lucide React** for ikoner

## Funktioner

### Offentlige sider
- **Forside** — Hero, værdier, fremhævede hunde, seneste nyheder
- **/hunde** — Liste over alle hunde med sundhedsbadges
- **/hunde/[id]** — Detaljeside: sundhed, mental, uddannelse, præstationer
- **/hvalpe** — Aktuelle kuld, planlagte kuld, venteliste
- **/om-os** — Historie, filosofi, resultater
- **/kontakt** — Kontaktinfo og formular

### Admin (kræver login)
- **/admin/hunde** — CRUD for hunde
- **/admin/hunde/ny** — Tilføj ny hund med foto-upload
- **/admin/hvalpe** — Administrer kuld
- **/admin/nyheder** — Publiser nyheder

## Kom i gang

### 1. Installer
```bash
npm install
```

### 2. Konfigurer Supabase (valgfrit)
Kopier `.env.example` til `.env.local` og udfyld med dine Supabase-credentials:
```bash
cp .env.example .env.local
```

Kør SQL-filen `supabase-schema.sql` i Supabase SQL Editor for at oprette tabeller, RLS-policies og mock data.

> **Uden Supabase** kører sitet med mock data, så du kan se designet med det samme.

### 3. Kør development server
```bash
npm run dev
```

Åbn [http://localhost:3000](http://localhost:3000)

### 4. Admin-adgang
1. Opret en bruger i Supabase Auth
2. Sæt brugerens `role` til `'admin'` i `profiles`-tabellen
3. Log ind på `/login`

## Database Schema

| Tabel | Beskrivelse |
|-------|-------------|
| `profiles` | Brugerprofiler med roller (admin/visitor) |
| `dogs` | Hunde med sundhed, mental, uddannelse |
| `dog_photos` | Fotos tilknyttet hunde (Supabase Storage) |
| `litters` | Kuld med forældre og antal |
| `litter_photos` | Fotos tilknyttet kuld |
| `news` | Nyheder/blogposts |

Alle tabeller har **RLS policies**: offentlig læsning, admin-kun skrivning.

## Storage

- Bucket: `dog-photos` (public)
- Struktur: `dogs/{dog_id}/`, `litters/{litter_id}/`

## Farvetema

| Brug | Farver |
|------|--------|
| Primær (grøn) | `green-950`, `green-900`, `green-700` |
| Accent (amber) | `amber-600`, `amber-100` |
| Baggrund | `amber-50/30`, hvid |
| Tekst | `stone-900`, `stone-600` |
