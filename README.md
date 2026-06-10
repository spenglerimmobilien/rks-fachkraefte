# RKS Fachkräfte — Website & Plattform

Mehrsprachige Recruiting-Plattform (DE/AR/FR/EN) für die Vermittlung qualifizierter Fachkräfte aus Marokko nach Deutschland.

## Features

- **Marketing-Website** mit 4 Sprachen (RTL für Arabisch)
- **Bewerbungs-Wizard** mit Dokumenten-Upload
- **Arbeitgeber-Anfrageformular**
- **Kandidaten-Portal** mit Status-Tracking
- **Arbeitgeber-Portal** mit anonymisierten Kandidatenprofilen
- **Admin-Dashboard** mit Kanban, Matching, Export
- **Tools**: Qualifikations-Rechner, Gehalts-Rechner, Visum-Timeline
- **WhatsApp-Integration**, PWA, SEO-Sitemap

## Schnellstart

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Öffnen: http://localhost:3000/de

### Admin-Zugang (nach Seed)

- E-Mail: `admin@rks-fachkraefte.de`
- Passwort: `admin123`

## Umgebungsvariablen

Kopieren Sie `.env.example` nach `.env`:

```
DATABASE_URL="file:./dev.db"
AUTH_SECRET="ihr-geheimer-schluessel"
NEXTAUTH_URL="http://localhost:3000"
```

Für Produktion PostgreSQL verwenden:
```
DATABASE_URL="postgresql://user:pass@host:5432/rks?schema=public"
```

## Deployment (Vercel)

1. Repository mit Vercel verbinden
2. Umgebungsvariablen setzen (DATABASE_URL, AUTH_SECRET, NEXTAUTH_URL)
3. PostgreSQL-Datenbank (Neon/Supabase) einrichten
4. `npx prisma migrate deploy` ausführen
5. Deploy

## Projektstruktur

```
src/
├── app/[locale]/     # Mehrsprachige Seiten
├── app/api/          # API Routes
├── components/       # UI, Forms, Portal, Tools
├── i18n/             # Internationalisierung
├── lib/              # Prisma, Auth, Utils
messages/             # Übersetzungen (de, ar, fr, en)
prisma/               # Datenbankschema
```

## Tech Stack

- Next.js 16, TypeScript, Tailwind CSS
- next-intl (i18n), NextAuth v5 (Auth)
- Prisma + SQLite/PostgreSQL
- shadcn/ui Komponenten
