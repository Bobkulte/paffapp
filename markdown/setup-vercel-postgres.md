# Setup Vercel Postgres (Neon)

## Pourquoi
- SQLite ne fonctionne pas sur Vercel (filesystem read-only)
- Vercel Postgres est integre au dashboard Vercel (zero compte externe)
- Base sur Neon (PostgreSQL serverless)
- Free tier : 512 MB, 1 database

## Configuration

### 1. Creer la base depuis Vercel
- Dashboard Vercel → projet → Storage → Create Database → Postgres
- Vercel genere automatiquement les variables d'env : `DATABASE_URL`, `DIRECT_URL`

### 2. Schema Prisma
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```
- `directUrl` est necessaire pour les migrations Prisma (connexion directe, pas pooled)

### 3. Variables d'environnement
```env
# Fournies automatiquement par Vercel Storage
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
DIRECT_URL="postgresql://user:password@host/dbname?sslmode=require"
```

### 4. Pousser le schema en prod
```bash
npx prisma db push
```

### 5. Seed en prod
```bash
npx tsx prisma/seed.ts
```

## Differences SQLite vs PostgreSQL pour Prisma
| Aspect | SQLite | PostgreSQL |
|--------|--------|------------|
| Provider | `"sqlite"` | `"postgresql"` |
| URL | `"file:./dev.db"` | `"postgresql://..."` |
| directUrl | Non necessaire | Necessaire (Neon pooling) |
| Types | Identiques via Prisma | Identiques via Prisma |
| Deploy | Fichier local | Serverless cloud |

## Reutilisation sur un autre projet
1. Creer un projet Vercel + activer Storage Postgres
2. Changer `provider = "postgresql"` dans schema.prisma
3. Ajouter `directUrl = env("DIRECT_URL")`
4. `npx prisma db push` pour creer les tables
5. Seeder la base
