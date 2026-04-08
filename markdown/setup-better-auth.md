# Migration NextAuth v4 -> Better Auth

## Pourquoi
- NextAuth v4 est legacy (l'equipe a rejoint Better Auth)
- Better Auth est plus simple, plus moderne, meilleur support TypeScript
- Adapter Prisma natif

## Installation
```bash
# Desinstaller NextAuth
npm uninstall next-auth

# Installer Better Auth
npm install better-auth
```

## Configuration serveur

### 1. Fichier auth principal : `src/lib/auth.ts`
```typescript
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql', // 'sqlite' pour dev local si besoin
  }),
  emailAndPassword: {
    enabled: true,
  },
});
```

### 2. Route API : `src/app/api/auth/[...all]/route.ts`
```typescript
import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

export const { GET, POST } = toNextJsHandler(auth);
```

### 3. Client auth : `src/lib/auth-client.ts`
```typescript
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient();
```

## Schema Prisma
Better Auth a besoin de ses propres tables. Ajouter/adapter dans `prisma/schema.prisma` :
- `user` (id, name, email, emailVerified, image, createdAt, updatedAt)
- `session` (id, expiresAt, token, ipAddress, userAgent, userId)
- `account` (id, accountId, providerId, userId, accessToken, refreshToken, etc.)
- `verification` (id, identifier, value, expiresAt, createdAt, updatedAt)

Ou generer automatiquement :
```bash
npx @better-auth/cli generate --config src/lib/auth.ts --output prisma/schema.prisma
```

## Utilisation

### Cote client (composants React)
```typescript
import { authClient } from '@/lib/auth-client';

// Login
await authClient.signIn.email({ email, password });

// Logout
await authClient.signOut();

// Session
const { data: session } = authClient.useSession();
```

### Cote serveur (Server Components / API Routes)
```typescript
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

const session = await auth.api.getSession({
  headers: await headers(),
});
```

## Middleware (protection des routes)
```typescript
// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

export async function middleware(request: NextRequest) {
  const session = getSessionCookie(request);
  
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)'],
};
```

## Variables d'environnement
```env
# .env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
DIRECT_URL="postgresql://user:password@host/dbname?sslmode=require"
BETTER_AUTH_SECRET="dev-secret-change-in-production-please"
BETTER_AUTH_URL="http://localhost:3000"  # En prod: https://ton-domaine.vercel.app
```

## Seed a adapter
Le seed doit creer les utilisateurs via Better Auth API ou directement en base avec le bon format de hash (Better Auth utilise aussi bcrypt par defaut).

## Reutilisation sur un autre projet
1. `npm install better-auth`
2. Creer `src/lib/auth.ts` (config serveur)
3. Creer `src/lib/auth-client.ts` (config client)
4. Creer la route API catch-all `api/auth/[...all]/route.ts`
5. Generer/adapter le schema Prisma
6. Creer le middleware
7. Configurer les variables d'env
