# Setup shadcn/ui

## Qu'est-ce que c'est
Bibliotheque de composants UI bases sur Radix UI + Tailwind CSS.
Les composants sont copies directement dans le projet (pas une dependance npm), donc entierement customisables.

## Installation
```bash
npx shadcn@latest init
```
Options recommandees :
- Style : **New York** (plus moderne)
- Base color : **Neutral** (ou Slate, a adapter avec la palette forge/iron)
- CSS variables : **Yes**

## Ajouter des composants
```bash
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add select
npx shadcn@latest add dialog        # = Modal
npx shadcn@latest add badge
npx shadcn@latest add card
npx shadcn@latest add table
npx shadcn@latest add dropdown-menu
npx shadcn@latest add sheet          # = Sidebar mobile
npx shadcn@latest add separator
npx shadcn@latest add label
npx shadcn@latest add textarea
npx shadcn@latest add toast
npx shadcn@latest add form           # = React Hook Form + Zod
```

## Composants necessaires pour Make My Estimate
| Composant | Usage |
|-----------|-------|
| `button` | Actions partout |
| `input` | Formulaires (login, materiaux, devis) |
| `label` | Labels de formulaire |
| `select` | Categories, unites |
| `dialog` | Modales (confirmation suppression, material picker) |
| `badge` | Statuts des devis (Brouillon, Envoye, Accepte, Refuse) |
| `card` | Dashboard, recapitulatifs |
| `table` | Liste materiaux, lignes de devis |
| `dropdown-menu` | Actions contextuelles |
| `sheet` | Sidebar responsive mobile |
| `separator` | Separation visuelle |
| `textarea` | Notes, descriptions |
| `toast` | Notifications (succes, erreur) |
| `form` | Validation formulaires avec Zod |

## Structure des fichiers
```
src/
├── components/
│   └── ui/          # Composants shadcn generes ici
│       ├── button.tsx
│       ├── input.tsx
│       ├── ...
├── lib/
│   └── utils.ts     # Fonction cn() generee par shadcn (merge classes Tailwind)
```

## Customisation avec la palette forge/iron
Apres `shadcn init`, modifier `globals.css` pour mapper les CSS variables sur la palette forge/iron du projet (definie dans `tailwind.config.ts`).

## Reutilisation sur un autre projet
1. `npx shadcn@latest init`
2. `npx shadcn@latest add [composants]`
3. Adapter les CSS variables au theme du projet
