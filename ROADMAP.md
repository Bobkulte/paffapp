# 🔨 Make My Estimate — Feuille de route

## Contexte du projet

Outil de création de devis pour ferronnier, déployé sur Vercel.  
Stack : **Next.js 14 (App Router)** / **SQLite + Prisma** / **NextAuth** / **Tailwind CSS** / **@react-pdf/renderer**

Architecture : séparation `models/` → `services/` → `components/` → `app/`

---

## Phase 0 — Initialisation du projet

### 0.1 Créer le projet Next.js
```bash
npx create-next-app@latest make-my-estimate --typescript --tailwind --app --src-dir --eslint
cd make-my-estimate
```

### 0.2 Installer les dépendances
```bash
npm install @prisma/client next-auth bcryptjs @react-pdf/renderer
npm install -D prisma tsx @types/bcryptjs
```

### 0.3 Configurer Prisma + SQLite
```bash
npx prisma init --datasource-provider sqlite
```
- Copier le fichier `prisma/schema.prisma` (fourni — contient les modèles User, Material, CompanyInfo, Estimate, EstimateLine)
- Copier le fichier `prisma/seed.ts` (fourni — contient l'utilisateur admin + ~35 matériaux de ferronnerie prédéfinis)
- Configurer `.env` avec `DATABASE_URL="file:./dev.db"`

```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 0.4 Structure des dossiers
```
src/
├── app/                    # Pages (App Router)
│   ├── api/                # API Routes
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── materials/route.ts
│   │   ├── estimates/route.ts
│   │   ├── estimates/[id]/route.ts
│   │   └── company/route.ts
│   ├── login/page.tsx
│   ├── dashboard/page.tsx
│   ├── materials/page.tsx
│   ├── estimates/
│   │   ├── page.tsx          # Liste des devis
│   │   ├── new/page.tsx      # Créer un devis
│   │   └── [id]/page.tsx     # Voir/éditer un devis
│   ├── settings/page.tsx
│   ├── layout.tsx
│   └── page.tsx              # Redirect vers /login ou /dashboard
├── components/
│   ├── ui/                 # Composants génériques (Button, Input, Modal, Badge)
│   ├── layout/             # Sidebar, Header, AuthProvider
│   ├── materials/          # MaterialForm, MaterialList, MaterialPicker
│   └── estimates/          # EstimateForm, EstimateLineRow, EstimatePDF
├── lib/
│   ├── prisma.ts           # Singleton Prisma (fourni)
│   └── auth.ts             # Config NextAuth (fourni)
├── models/
│   └── types.ts            # Types TypeScript (fourni)
└── services/
    ├── materialService.ts  # CRUD matériaux (fourni)
    ├── estimateService.ts  # CRUD devis + calculs (fourni)
    └── companyService.ts   # Infos entreprise (fourni)
```

### 0.5 Fichiers déjà fournis (à copier tels quels)
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `src/lib/prisma.ts`
- `src/lib/auth.ts`
- `src/models/types.ts`
- `src/services/materialService.ts`
- `src/services/estimateService.ts`
- `src/services/companyService.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/api/materials/route.ts`
- `tailwind.config.ts` (avec palette forge/iron)
- `next.config.js`
- `.env`
- `.gitignore`

---

## Phase 1 — Authentification & Layout

### 1.1 AuthProvider (composant client)
- Fichier : `src/components/layout/AuthProvider.tsx`
- Wrapper `SessionProvider` de next-auth autour de l'app
- Intégrer dans `src/app/layout.tsx`

### 1.2 Middleware de protection des routes
- Fichier : `src/middleware.ts`
- Protéger toutes les routes sauf `/login` et `/api/auth`
- Rediriger vers `/login` si pas de session

### 1.3 Page de login
- Fichier : `src/app/login/page.tsx`
- Formulaire email + mot de passe
- Appel `signIn('credentials', ...)` de next-auth
- Redirection vers `/dashboard` après connexion
- Design : sobre, centré, thème forge (couleurs chaudes, ambiance atelier)

### 1.4 Layout principal (sidebar + header)
- `src/components/layout/Sidebar.tsx` — Navigation verticale avec les liens :
  - Dashboard, Matériaux, Nouveau devis, Mes devis, Paramètres
  - Bouton déconnexion
- `src/components/layout/Header.tsx` — Nom de l'utilisateur connecté, titre de la page
- `src/app/(authenticated)/layout.tsx` — Layout wrapper avec Sidebar + Header pour toutes les pages protégées

### 1.5 Page d'accueil
- `src/app/page.tsx` — Redirect vers `/dashboard` si connecté, sinon `/login`

---

## Phase 2 — Gestion des matériaux (CRUD)

### 2.1 Composants UI de base
Créer les composants réutilisables dans `src/components/ui/` :
- `Button.tsx` — Variantes : primary, secondary, danger, ghost + tailles
- `Input.tsx` — Input avec label, erreur, icône optionnelle
- `Select.tsx` — Select avec label
- `Modal.tsx` — Modale overlay réutilisable
- `Badge.tsx` — Badge coloré pour catégories/statuts
- `Card.tsx` — Conteneur carte avec ombre

### 2.2 Liste des matériaux
- Fichier : `src/app/materials/page.tsx`
- Afficher tous les matériaux groupés par catégorie (accordéon ou tabs)
- Barre de recherche pour filtrer
- Bouton "Ajouter un matériau" → ouvre la modale
- Chaque ligne : nom, catégorie, unité, prix unitaire, actions (éditer/supprimer)

### 2.3 Formulaire matériau (création + édition)
- Fichier : `src/components/materials/MaterialForm.tsx`
- Champs : nom, catégorie (select avec les catégories prédéfinies + "Autre"), unité (select), prix unitaire, description
- Validation côté client
- Mode création et mode édition (pré-remplissage)

### 2.4 Suppression avec confirmation
- Modale de confirmation avant suppression
- Vérifier qu'aucun devis n'utilise ce matériau (ou avertir)

---

## Phase 3 — Création de devis

### 3.1 API route devis
- `src/app/api/estimates/route.ts` — GET (liste) + POST (création)
- `src/app/api/estimates/[id]/route.ts` — GET (détail) + PUT (update) + DELETE

### 3.2 Sélecteur de matériaux
- Fichier : `src/components/estimates/MaterialPicker.tsx`
- Dropdown/modale de recherche dans les matériaux existants
- Filtrer par catégorie ou par recherche texte
- Au clic : ajoute une ligne au devis avec nom, unité, prix pré-remplis
- Option "Ligne personnalisée" pour ajouter un poste libre (sans matériau lié)

### 3.3 Ligne de devis
- Fichier : `src/components/estimates/EstimateLineRow.tsx`
- Affiche : désignation, quantité (input), unité, prix unitaire (input modifiable), total HT (calculé)
- Bouton supprimer la ligne
- Recalcul automatique du total quand quantité ou prix change

### 3.4 Formulaire de devis complet
- Fichier : `src/components/estimates/EstimateForm.tsx`
- **Section client** : nom (obligatoire), email, téléphone, adresse, ville, code postal
- **Section date** : date du devis (par défaut aujourd'hui, modifiable), date de validité
- **Section lignes** : liste des EstimateLineRow + bouton ajouter (MaterialPicker)
- **Section récapitulatif** : total HT, taux TVA (modifiable, défaut 20%), total TVA, total TTC
- **Section notes** : champ texte libre pour conditions, remarques
- Bouton "Enregistrer en brouillon" + "Enregistrer et générer PDF"

### 3.5 Page nouveau devis
- Fichier : `src/app/estimates/new/page.tsx`
- Intègre `EstimateForm` en mode création
- Référence auto-générée (DEV-2026-0001, etc.)

---

## Phase 4 — Liste et détail des devis

### 4.1 Page liste des devis
- Fichier : `src/app/estimates/page.tsx`
- Tableau : référence, client, date, total TTC, statut (badge coloré)
- Filtres : par statut (tous/brouillon/envoyé/accepté/refusé)
- Actions : voir, dupliquer, supprimer
- Tri par date décroissante

### 4.2 Page détail/édition d'un devis
- Fichier : `src/app/estimates/[id]/page.tsx`
- Affiche le devis avec `EstimateForm` en mode édition (pré-rempli)
- Boutons : Modifier le statut, Générer PDF, Supprimer
- Historique du statut (optionnel)

---

## Phase 5 — Génération PDF

### 5.1 Template PDF du devis
- Fichier : `src/components/estimates/EstimatePDF.tsx`
- Utiliser `@react-pdf/renderer` (Document, Page, View, Text, StyleSheet)
- Layout du PDF :
  - **En-tête** : Infos entreprise (nom, adresse, SIRET, TVA) à gauche / Logo à droite
  - **Bloc client** : Nom, adresse complète du client
  - **Métadonnées** : Référence devis, date, date de validité
  - **Tableau des lignes** : colonnes Désignation | Qté | Unité | PU HT | Total HT
  - **Totaux** : Total HT, TVA (taux + montant), Total TTC — alignés à droite
  - **Notes** : conditions de règlement, remarques
  - **Pied de page** : mentions légales, SIRET, numéro de page

### 5.2 API route génération PDF
- `src/app/api/estimates/[id]/pdf/route.ts`
- Récupérer le devis + infos entreprise
- Générer le PDF avec `renderToBuffer` de @react-pdf/renderer
- Retourner le fichier PDF en réponse (Content-Type application/pdf)

### 5.3 Bouton télécharger PDF
- Dans la page détail du devis, bouton "Télécharger PDF"
- Appel GET vers `/api/estimates/[id]/pdf`
- Téléchargement automatique du fichier `DEV-2026-0001.pdf`

---

## Phase 6 — Page Paramètres (personnalisation entreprise)

### 6.1 API route infos entreprise
- `src/app/api/company/route.ts` — GET + PUT

### 6.2 Page paramètres
- Fichier : `src/app/settings/page.tsx`
- Formulaire éditable : nom entreprise, adresse, ville, code postal, téléphone, email, SIRET, N° TVA
- Upload logo (optionnel — stocker en base64 ou fichier local)
- Bouton sauvegarder
- Prévisualisation live : "Voici comment apparaîtra l'en-tête de vos devis"

---

## Phase 7 — Dashboard

### 7.1 Page dashboard
- Fichier : `src/app/dashboard/page.tsx`
- **Cartes résumé** : Nombre total de devis, Devis en brouillon, Devis acceptés, CA total (somme TTC des acceptés)
- **Derniers devis** : 5 derniers devis avec référence, client, montant, statut
- **Accès rapide** : boutons "Nouveau devis" et "Gérer les matériaux"

---

## Phase 8 — Déploiement Vercel

### 8.1 Préparer pour Vercel
- ⚠️ **SQLite ne fonctionne pas sur Vercel en production** (filesystem read-only)
- Options :
  - **Option A (recommandée)** : Migrer vers **Turso** (SQLite en edge, compatible Prisma) — gratuit pour petits projets
  - **Option B** : Migrer vers **PostgreSQL** via Vercel Postgres ou Supabase
  - **Option C** : Garder SQLite en local/VPS classique au lieu de Vercel

### 8.2 Migration Turso (si Option A)
```bash
npm install @libsql/client @prisma/adapter-libsql
```
- Créer un compte Turso, créer une base
- Modifier `prisma/schema.prisma` : changer le provider et l'URL
- Modifier `src/lib/prisma.ts` pour utiliser l'adapter Turso

### 8.3 Variables d'environnement Vercel
- `DATABASE_URL` — URL Turso ou Postgres
- `NEXTAUTH_SECRET` — Générer avec `openssl rand -base64 32`
- `NEXTAUTH_URL` — URL de production (https://make-my-estimate.vercel.app)

### 8.4 Déployer
```bash
npm install -g vercel
vercel
```

---

## Ordre d'exécution recommandé pour Claude Code

Donner ces instructions à Claude Code étape par étape :

```
Étape 1 : "Initialise le projet Next.js, installe les dépendances, copie tous les fichiers
           fournis (prisma, lib, models, services, api materials, configs). 
           Lance prisma db push et le seed."

Étape 2 : "Crée l'authentification : AuthProvider, middleware, page login. 
           Crée le layout avec Sidebar et Header."

Étape 3 : "Crée les composants UI de base (Button, Input, Select, Modal, Badge, Card).
           Crée la page matériaux avec le CRUD complet."

Étape 4 : "Crée les API routes pour les devis. 
           Crée MaterialPicker, EstimateLineRow, EstimateForm.
           Crée la page nouveau devis."

Étape 5 : "Crée la page liste des devis et la page détail/édition."

Étape 6 : "Crée le template PDF avec @react-pdf/renderer. 
           Crée l'API route de génération PDF. 
           Ajoute le bouton télécharger dans la page détail."

Étape 7 : "Crée la page paramètres entreprise avec le formulaire et la prévisualisation."

Étape 8 : "Crée la page dashboard avec les cartes résumé et derniers devis."

Étape 9 : "Prépare le déploiement : migration Turso ou Postgres, 
           configuration Vercel, variables d'environnement."
```

---

## Identifiants par défaut (seed)

| Champ         | Valeur                       |
|---------------|------------------------------|
| Email         | admin@makemyestimate.fr      |
| Mot de passe  | admin123                     |

⚠️ **Changer le mot de passe en production !**

---

## Stack technique résumé

| Élément          | Technologie                  |
|------------------|------------------------------|
| Framework        | Next.js 14 (App Router)      |
| Langage          | TypeScript                   |
| Base de données  | SQLite → Turso (prod)        |
| ORM              | Prisma                       |
| Auth             | NextAuth v4 (Credentials)    |
| Style            | Tailwind CSS                 |
| PDF              | @react-pdf/renderer          |
| Déploiement      | Vercel                       |
