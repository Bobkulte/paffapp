# Skills installes pour Claude Code

## Commande d'installation
```bash
npx skills add shadcn/ui -y
npx skills add vercel-labs/next-skills -y
npx skills add vercel-labs/agent-skills -y
```

## Skills disponibles

### shadcn/ui (1 skill)
| Skill | Description | Invocable |
|-------|-------------|-----------|
| `shadcn` | Gere les composants shadcn/ui : ajout, recherche, debug, style, composition. Fournit le contexte projet, la doc des composants et des exemples. | Auto (se declenche quand on travaille avec shadcn/ui) |

### vercel-labs/next-skills (3 skills)
| Skill | Description | Invocable |
|-------|-------------|-----------|
| `next-best-practices` | Best practices Next.js : file conventions, RSC boundaries, data patterns, async APIs, metadata, error handling, route handlers, image/font, bundling | Auto |
| `next-cache-components` | Next.js 16 Cache Components : PPR, `use cache` directive, cacheLife, cacheTag, updateTag | Auto |
| `next-upgrade` | Upgrade Next.js vers la derniere version avec les guides de migration et codemods | `/next-upgrade [version]` |

### vercel-labs/agent-skills (7 skills)
| Skill | Description | Invocable |
|-------|-------------|-----------|
| `deploy-to-vercel` | Deployer une app sur Vercel (preview ou prod) | `/deploy-to-vercel` |
| `vercel-cli-with-tokens` | Gerer les projets Vercel via CLI avec tokens (pas de login interactif) | Auto |
| `vercel-react-best-practices` | Guidelines de performance React/Next.js par Vercel Engineering : composants, data fetching, bundle optimization | Auto |
| `vercel-composition-patterns` | Patterns de composition React : refactoring, component libraries, scalabilite | Auto |
| `vercel-react-view-transitions` | Animations fluides avec la View Transition API de React (`<ViewTransition>`, transitions de page) | Auto |
| `vercel-react-native-skills` | Best practices React Native / Expo (pas utilise dans ce projet) | Auto |
| `web-design-guidelines` | Audit UI : accessibilite, UX, design, conformite Web Interface Guidelines | `/web-design-guidelines` |

## Ou sont stockes les skills
```
.agents/skills/
├── shadcn/
├── next-best-practices/
├── next-cache-components/
├── next-upgrade/
├── deploy-to-vercel/
├── vercel-cli-with-tokens/
├── vercel-composition-patterns/
├── vercel-react-best-practices/
├── vercel-react-native-skills/
├── vercel-react-view-transitions/
└── web-design-guidelines/
```

## Reutilisation sur un autre projet
Copier les 3 commandes `npx skills add` ci-dessus dans le nouveau projet. Les skills sont installes par projet (dans `.agents/skills/`).
