# Make My Estimate

## Description
Outil web de création et gestion de devis pour artisan ferronnier.
Permet de gérer un catalogue de matériaux, créer des devis, générer des PDF personnalisés.

## Stack
- **Next.js 14** (App Router, TypeScript)
- **Prisma** + **PostgreSQL** (Vercel Postgres / Neon)
- **Better Auth** (email/password)
- **Tailwind CSS** (palette custom forge/iron)
- **shadcn/ui** (composants UI)
- **@react-pdf/renderer** pour la génération PDF
- Déploiement : **Vercel**

## Architecture
```
src/
├── models/      # Types TypeScript (pas de logique)
├── services/    # Logique métier (materialService, estimateService, companyService)
├── components/  # UI réutilisable
│   ├── ui/      # Composants shadcn/ui
│   ├── layout/  # Sidebar, Header
│   ├── materials/
│   └── estimates/
├── lib/         # Prisma singleton, Better Auth config, auth-client, session helper
└── app/         # Pages + API routes (App Router)
    ├── login/           # Page login (publique)
    ├── (authenticated)/ # Layout avec Sidebar pour pages protégées
    └── api/             # API routes
```

## Conventions
- Français pour l'UI et les commentaires
- Anglais pour le code (noms de variables, fonctions, types)
- Composants React : functional components avec hooks
- Services : fonctions pures qui appellent Prisma, importées dans les API routes
- API routes : validation + appel service + réponse JSON
- Pages protégées par middleware Better Auth (sauf /login)
- UI avec shadcn/ui (pas de composants custom quand shadcn en a un)

## Base de données
- Schéma dans `prisma/schema.prisma` (PostgreSQL)
- Seed dans `prisma/seed.ts` (admin + matériaux ferronnerie)
- Commandes : `npx prisma db push`, `npx tsx prisma/seed.ts`

## Identifiants dev
- Email : admin@makemyestimate.fr
- Mot de passe : admin123

## Feuille de route
Voir `ROADMAP.md` pour l'ordre d'implémentation détaillé (Phase 0 à 8).
Voir `markdown/` pour les résumés de session et guides de setup.
