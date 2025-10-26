# Geeks Patrol - Blog Tech Astro

Un blog moderne sur les technologies, l'IA et le lifestyle geek, construit avec Astro, React et Supabase.

## 🚀 Structure du Projet

```
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── ArticleCard.tsx
│   │   ├── ads/
│   │   │   ├── AdBanner.tsx
│   │   │   └── AdSlot.tsx
│   │   └── ui/ (composants réutilisables)
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── AdminLayout.astro
│   │   └── ArticleLayout.astro
│   ├── pages/
│   │   ├── index.astro          # Page d'accueil
│   │   ├── blog/
│   │   │   ├── index.astro      # Liste des articles
│   │   │   └── [...slug].astro  # Article individuel
│   │   ├── category/
│   │   │   └── [slug].astro     # Articles par catégorie
│   │   ├── admin/
│   │   │   ├── index.astro      # Redirection admin
│   │   │   ├── login.astro      # Page de connexion admin
│   │   │   ├── dashboard.astro  # Tableau de bord admin
│   │   │   ├── edit/
│   │   │   │   └── [id].astro   # Édition d'article
│   │   │   └── api/
│   │   │       └── logout.ts    # API de déconnexion
│   │   └── under-construction.astro
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts
│   └── config/
│       └── navigation.ts
└── package.json
```

## �️ Technologies Utilisées

- **Astro** - Framework web moderne
- **React** - Composants interactifs
- **Tailwind CSS** - Framework CSS
- **Supabase** - Base de données et authentification
- **TypeScript** - Typage statique

## 🚀 Démarrage Rapide

1. **Installation des dépendances**
   ```bash
   npm install
   ```

2. **Configuration Supabase**
   - Créer un projet Supabase
   - Copier les clés API dans `src/lib/supabase.ts`

3. **Démarrage du serveur de développement**
   ```bash
   npm run dev
   ```

4. **Build pour la production**
   ```bash
   npm run build
   ```

## � Organisation des Pages

### Pages Publiques
- `/` - Page d'accueil avec articles en vedette
- `/blog` - Liste de tous les articles
- `/blog/[slug]` - Article individuel
- `/category/[slug]` - Articles par catégorie

### Administration
- `/admin` - Redirection automatique vers login ou dashboard
- `/admin/login` - Page de connexion administrateur
- `/admin/dashboard` - Tableau de bord avec gestion des articles
- `/admin/edit/[id]` - Édition d'un article

## 🔐 Authentification Admin

L'authentification admin utilise Supabase Auth avec une interface HTML propre (pas de JSON brut). Les erreurs sont affichées directement dans la page avec des messages utilisateur-friendly.

## 📦 Scripts Disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Build de production
- `npm run preview` - Prévisualisation du build
- `npm run astro` - Commandes Astro

## 🎨 Fonctionnalités

- ✅ Design responsive avec Tailwind CSS
- ✅ Authentification admin sécurisée
- ✅ Gestion des articles avec Supabase
- ✅ Système de catégories
- ✅ Intégration publicitaire AdSense
- ✅ SEO optimisé
- ✅ Mode sombre/clair

## 📝 Développement

Le projet suit une architecture propre avec séparation des préoccupations :
- **Components** : Composants réutilisables
- **Layouts** : Structures de page
- **Pages** : Routes de l'application
- **Lib** : Utilitaires et configurations
- **Types** : Définitions TypeScript

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
