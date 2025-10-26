# 🚀 API n8n - GeeksPatrol

API REST sécurisée pour l'intégration avec n8n et l'automatisation de la création d'articles.

## 📚 Documentation complète

Voir [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) pour la documentation complète.

## ⚡ Quick Start

### 1. Configuration

Ajoutez votre clé API dans `.env` :

```bash
# Générer une clé sécurisée
openssl rand -base64 32

# Ajouter dans .env
N8N_API_KEY=votre_clé_générée
```

### 2. Endpoints disponibles

| Méthode | Endpoint | Description | Auth requise |
|---------|----------|-------------|--------------|
| `POST` | `/api/articles/create.json` | Créer un article | ✅ Oui |
| `GET` | `/api/categories/list.json` | Lister les catégories | ⚠️ Optionnelle |

### 3. Exemple rapide

```bash
# Lister les catégories
curl http://localhost:4321/api/categories/list.json

# Créer un article
curl -X POST http://localhost:4321/api/articles/create.json \
  -H "Content-Type: application/json" \
  -H "X-API-Key: VOTRE_CLE_API" \
  -d '{
    "title": "Mon article",
    "content": "<p>Contenu de mon article</p>",
    "status": "approved",
    "category_ids": [1, 2]
  }'
```

## 🧪 Tests

Exécutez les tests automatiques :

```bash
./test-api.sh
```

Nécessite `jq` installé : `brew install jq`

## 🔧 Intégration n8n

### Importer le workflow

1. Ouvrez n8n
2. Cliquez sur "Import from File"
3. Sélectionnez `n8n-workflow-example.json`
4. Configurez votre `N8N_API_KEY` dans les variables d'environnement n8n

### Configuration requise dans n8n

```bash
# Variables d'environnement n8n
N8N_API_KEY=votre_clé_api
```

## 📊 Schéma des données

### Article (POST /api/articles/create.json)

```typescript
{
  // REQUIS
  title: string;           // Titre de l'article
  content: string;         // Contenu HTML

  // OPTIONNELS
  excerpt?: string;        // Auto-généré si absent
  slug?: string;           // Auto-généré depuis title
  status?: 'draft' | 'approved' | 'archived';  // Défaut: 'draft'
  cover_image_path?: string;
  cover_image_alt?: string;
  reading_time?: number;   // Calculé automatiquement
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  category_ids?: number[]; // IDs des catégories
  sources?: Array<{
    name: string;
    url: string;
  }>;
}
```

### Catégories (GET /api/categories/list.json)

```typescript
{
  success: true,
  categories: Array<{
    id: number;
    name: string;
    slug: string;
    description: string;
  }>
}
```

## 🔒 Sécurité

- ✅ Authentification par clé API (header `X-API-Key`)
- ✅ Validation des champs requis
- ✅ Protection contre les injections
- ⚠️ Utilisez HTTPS en production
- ⚠️ Ne commitez JAMAIS votre clé API

## 🎯 Cas d'usage n8n

### 1. Publication automatique depuis RSS

```
RSS Trigger → Parse Content → Create Article API
```

### 2. Veille technologique

```
Schedule → Scrape Tech News → Format → Create Article API
```

### 3. Newsletter vers articles

```
Email Trigger → Extract Content → Create Article API → Notify
```

### 4. Génération d'articles par IA

```
Trigger → OpenAI API → Format HTML → Create Article API
```

## 🐛 Debugging

### Vérifier la configuration

```bash
# Tester la connexion
curl http://localhost:4321/api/categories/list.json

# Vérifier l'authentification
curl -H "X-API-Key: VOTRE_CLE" http://localhost:4321/api/categories/list.json
```

### Logs

Les erreurs sont loguées dans la console du serveur Astro.

### Codes d'erreur

| Code | Description |
|------|-------------|
| `200` | ✅ Succès (GET) |
| `201` | ✅ Article créé |
| `400` | ❌ Requête invalide (champs manquants) |
| `401` | ❌ Clé API invalide |
| `500` | ❌ Erreur serveur |

## 📝 Exemples de workflows

Voir `n8n-workflow-example.json` pour un exemple complet incluant :
- ✅ Récupération des catégories
- ✅ Mapping automatique des catégories
- ✅ Création d'article
- ✅ Gestion des erreurs

## 🔗 Ressources

- [Documentation API complète](./API_DOCUMENTATION.md)
- [Workflow n8n exemple](./n8n-workflow-example.json)
- [Script de test](./test-api.sh)
- [Documentation Astro](https://docs.astro.build)
- [Documentation n8n](https://docs.n8n.io)

## 💡 Tips

1. **Auto-génération** : Les champs `slug`, `excerpt` et `reading_time` sont automatiquement générés
2. **Statuts** : Utilisez `"status": "draft"` pour modération avant publication
3. **Catégories** : Récupérez les IDs avec `/api/categories/list.json`
4. **Sources** : Ajoutez des sources pour la crédibilité
5. **SEO** : Remplissez `seo_title`, `seo_description` et `seo_keywords` pour un meilleur référencement

---

Made with ❤️ for GeeksPatrol
