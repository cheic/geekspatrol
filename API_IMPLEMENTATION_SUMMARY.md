# ✅ API n8n - Récapitulatif de l'implémentation

## 🎯 Objectif

Créer une API REST sécurisée permettant à n8n (ou tout autre outil) d'ajouter automatiquement des articles sur GeeksPatrol.

---

## 📦 Fichiers créés

### 1. API Endpoints

#### `/src/pages/api/articles/create.json.ts` ✅
- **Méthode** : POST
- **Fonction** : Créer un nouvel article
- **Authentification** : Clé API (header `X-API-Key`)
- **Fonctionnalités** :
  - ✅ Validation des champs requis (`title`, `content`)
  - ✅ Auto-génération du slug depuis le titre
  - ✅ Calcul automatique du temps de lecture
  - ✅ Auto-génération de l'excerpt si absent
  - ✅ Support des catégories multiples
  - ✅ Support des sources
  - ✅ Gestion complète des erreurs (400, 401, 500)

#### `/src/pages/api/categories/list.json.ts` ✅
- **Méthode** : GET
- **Fonction** : Lister toutes les catégories
- **Authentification** : Optionnelle
- **Usage** : Permet à n8n de récupérer les IDs des catégories

---

### 2. Documentation

#### `API_DOCUMENTATION.md` ✅
Documentation technique complète :
- 📋 Configuration requise
- 📋 Schéma complet de l'API
- 📋 Exemples de requêtes (cURL, n8n)
- 📋 Codes de réponse
- 📋 Gestion des erreurs
- 📋 Notes de sécurité

#### `API_README.md` ✅
Guide de démarrage rapide :
- ⚡ Quick start
- ⚡ Exemples pratiques
- ⚡ Cas d'usage n8n
- ⚡ Debugging
- ⚡ Tips et astuces

---

### 3. Outils et exemples

#### `n8n-workflow-example.json` ✅
Workflow n8n complet et fonctionnel :
- 🔄 Webhook trigger
- 🔄 Récupération des catégories
- 🔄 Mapping automatique des catégories
- 🔄 Création de l'article
- 🔄 Gestion des succès/erreurs
- 🔄 Réponse au webhook

#### `test-api.sh` ✅
Script de test automatisé :
- 🧪 Test GET categories
- 🧪 Test POST article (draft)
- 🧪 Test POST article (approved)
- 🧪 Test POST multi-catégories
- 🧪 Test erreur clé API invalide
- 🧪 Test erreur champs manquants

---

### 4. Configuration

#### `.env` ✅
Ajout de la clé API :
```env
N8N_API_KEY=6T941FIFyj/zyAzApBD0Qw/hIejqUGxZo2S6GVQXYQ4=
```

#### `.env.example` ✅
Template pour la configuration :
```env
N8N_API_KEY=your_secret_api_key_here
```

---

## 🔐 Sécurité

### Authentification
- ✅ Clé API stockée dans `.env` (non commitée)
- ✅ Vérification sur chaque requête POST
- ✅ Header personnalisé `X-API-Key`
- ✅ Clé générée avec `openssl rand -base64 32`

### Validation
- ✅ Vérification des champs requis
- ✅ Sanitization des slugs
- ✅ Gestion des erreurs SQL
- ✅ Réponses JSON normalisées

---

## 📊 Structure de données

### Article créé via API

```json
{
  "title": "REQUIS - Titre",
  "content": "REQUIS - Contenu HTML",
  "excerpt": "Optionnel - Auto-généré",
  "slug": "Optionnel - Auto-généré",
  "status": "draft|approved|archived",
  "category_ids": [1, 2, 3],
  "sources": [
    {"name": "Source", "url": "https://..."}
  ],
  "cover_image_path": "/images/...",
  "seo_title": "Titre SEO",
  "seo_description": "Description",
  "seo_keywords": "mot1, mot2"
}
```

---

## 🚀 Utilisation

### 1. Configuration initiale

```bash
# 1. Générer une clé API
openssl rand -base64 32

# 2. Ajouter dans .env
echo "N8N_API_KEY=votre_clé" >> .env

# 3. Démarrer le serveur
npm run dev
```

### 2. Test rapide

```bash
# Lister les catégories
curl http://localhost:4321/api/categories/list.json

# Créer un article
curl -X POST http://localhost:4321/api/articles/create.json \
  -H "Content-Type: application/json" \
  -H "X-API-Key: VOTRE_CLE" \
  -d '{"title":"Test","content":"<p>Test</p>","status":"approved"}'
```

### 3. Tests automatisés

```bash
./test-api.sh
```

---

## 🎯 Cas d'usage n8n

### Workflow 1 : RSS → Articles
```
[RSS Feed] → [Parse HTML] → [API Create] → [Success]
```

### Workflow 2 : Veille automatique
```
[Schedule] → [Scrape News] → [Format] → [API Create] → [Notify Slack]
```

### Workflow 3 : IA Content
```
[Trigger] → [OpenAI GPT-4] → [Format HTML] → [API Create] → [Publish]
```

### Workflow 4 : Newsletter
```
[Email Trigger] → [Extract] → [API Create] → [Send Confirmation]
```

---

## ✨ Fonctionnalités auto

L'API génère automatiquement :

1. **Slug** : `"Mon Article IA"` → `"mon-article-ia"`
2. **Excerpt** : Premiers 200 caractères du contenu
3. **Temps de lecture** : Calculé (~200 mots/min)
4. **SEO Title** : Utilise `title` par défaut
5. **Date** : `created_at` automatique

---

## 📈 Exemples de réponses

### ✅ Succès (201)

```json
{
  "success": true,
  "message": "Article créé avec succès",
  "article": {
    "id": 123,
    "title": "Mon article",
    "slug": "mon-article",
    "status": "approved",
    "article_categories": [...],
    "sources": [...]
  }
}
```

### ❌ Erreur clé API (401)

```json
{
  "error": "Non autorisé - Clé API invalide ou manquante"
}
```

### ❌ Erreur champs manquants (400)

```json
{
  "error": "Champs requis manquants: title, content"
}
```

---

## 🔗 URLs de l'API

| Endpoint | URL Production | URL Dev |
|----------|----------------|---------|
| Categories | `https://geekspatrol.com/api/categories/list.json` | `http://localhost:4321/api/categories/list.json` |
| Create Article | `https://geekspatrol.com/api/articles/create.json` | `http://localhost:4321/api/articles/create.json` |

---

## 📚 Documentation

- 📖 [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Documentation technique complète
- 📖 [API_README.md](./API_README.md) - Guide de démarrage rapide
- 📖 [n8n-workflow-example.json](./n8n-workflow-example.json) - Workflow n8n
- 📖 [test-api.sh](./test-api.sh) - Tests automatisés

---

## ✅ Checklist de déploiement

Avant de déployer en production :

- [ ] ✅ Créer une nouvelle clé API forte
- [ ] ✅ Ajouter `N8N_API_KEY` dans les variables d'environnement de production
- [ ] ✅ Vérifier que `.env` est dans `.gitignore`
- [ ] ✅ Tester tous les endpoints en production
- [ ] ✅ Configurer HTTPS (obligatoire)
- [ ] ✅ Configurer le workflow n8n
- [ ] ✅ Tester le workflow de bout en bout
- [ ] ✅ Configurer les notifications d'erreur
- [ ] ✅ Documenter pour l'équipe

---

## 🎉 Résultat

L'API est maintenant prête pour :
- ✅ Automatisation complète avec n8n
- ✅ Publication d'articles depuis n'importe quelle source
- ✅ Intégration avec des outils tiers
- ✅ Workflows personnalisés
- ✅ Scalabilité et fiabilité

---

**Clé API actuelle** : `6T941FIFyj/zyAzApBD0Qw/hIejqUGxZo2S6GVQXYQ4=`

⚠️ **Important** : Changez cette clé en production !
