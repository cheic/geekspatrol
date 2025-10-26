# API Documentation pour n8n

## Configuration

### Variable d'environnement requise

Ajoutez dans votre fichier `.env` :

```env
N8N_API_KEY=votre_clé_secrète_ici
```

Générez une clé sécurisée, par exemple :
```bash
openssl rand -base64 32
```

---

## Endpoints disponibles

### 1. Créer un article

**Endpoint:** `POST /api/articles/create.json`

**Headers requis:**
```
Content-Type: application/json
X-API-Key: votre_clé_API
```

**Corps de la requête (JSON):**

```json
{
  "title": "Titre de l'article",          // REQUIS
  "content": "<p>Contenu HTML...</p>",    // REQUIS
  "excerpt": "Résumé de l'article",       // Optionnel (auto-généré si absent)
  "slug": "titre-article",                // Optionnel (auto-généré depuis title)
  "cover_image_path": "/images/cover.jpg", // Optionnel
  "cover_image_alt": "Description image",  // Optionnel
  "status": "draft",                      // ⚠️ IGNORÉ - Toujours forcé à "draft" pour validation manuelle
  "reading_time": 5,                      // Optionnel (calculé automatiquement si absent)
  "author_id": "uuid-author",             // Optionnel (UUID de l'auteur, utilise N8N_DEFAULT_AUTHOR_ID si absent)
  "category_ids": [1, 2, 3],              // Optionnel (tableau d'IDs)
  "sources": [                            // Optionnel
    {
      "name": "Source 1",
      "url": "https://example.com"
    },
    {
      "name": "Source 2",
      "url": "https://example2.com"
    }
  ]
}
```

**Réponse succès (201):**
```json
{
  "success": true,
  "message": "Article créé avec succès",
  "article": {
    "id": 123,
    "title": "Titre de l'article",
    "slug": "titre-article",
    "content": "<p>Contenu...</p>",
    "excerpt": "Résumé...",
    "status": "draft",
    "created_at": "2025-10-26T12:00:00Z",
    "article_categories": [...],
    "sources": [...]
  }
}
```

**Réponse erreur (400):**
```json
{
  "error": "Champs requis manquants: title, content"
}
```

**Réponse erreur (401):**
```json
{
  "error": "Non autorisé - Clé API invalide ou manquante"
}
```

---

### 2. Lister les catégories

**Endpoint:** `GET /api/categories/list.json`

**Headers optionnels:**
```
X-API-Key: votre_clé_API
```

**Réponse succès (200):**
```json
{
  "success": true,
  "categories": [
    {
      "id": 1,
      "name": "Intelligence Artificielle",
      "slug": "ia",
      "description": "Articles sur l'IA"
    }
  ]
}
```

---

### 3. Lister les auteurs

**Endpoint:** `GET /api/authors/list.json`

**Headers optionnels:**
```
X-API-Key: votre_clé_API
```

**Réponse succès (200):**
```json
{
  "success": true,
  "authors": [
    {
      "id": "00000000-0000-0000-0000-000000000001",
      "name": "n8n Automation",
      "email": "automation@geekspatrol.com",
      "bio": "Articles générés automatiquement via n8n",
      "avatar_url": "/images/avatars/n8n-bot.png"
    }
  ]
}
```

---

## Exemples d'utilisation

### cURL

```bash
# Créer un article
curl -X POST https://votre-site.com/api/articles/create.json \
  -H "Content-Type: application/json" \
  -H "X-API-Key: votre_clé_API" \
  -d '{
    "title": "Mon premier article via API",
    "content": "<p>Contenu de mon article</p>",
    "excerpt": "Un résumé rapide",
    "status": "approved",
    "category_ids": [1, 3]
  }'

# Lister les catégories
curl https://votre-site.com/api/categories/list.json \
  -H "X-API-Key: votre_clé_API"
```

### n8n - HTTP Request Node

**Configuration pour créer un article:**

1. **Method:** POST
2. **URL:** `https://votre-site.com/api/articles/create.json`
3. **Authentication:** None (utilise Header)
4. **Headers:**
   - Name: `Content-Type`, Value: `application/json`
   - Name: `X-API-Key`, Value: `{{$env.N8N_API_KEY}}`
5. **Body:**
   - Type: JSON
   - JSON:
   ```json
   {
     "title": "{{$json.title}}",
     "content": "{{$json.content}}",
     "excerpt": "{{$json.excerpt}}",
     "status": "approved",
     "category_ids": {{$json.categories}}
   }
   ```

**Configuration pour lister les catégories:**

1. **Method:** GET
2. **URL:** `https://votre-site.com/api/categories/list.json`
3. **Authentication:** None
4. **Headers:**
   - Name: `X-API-Key`, Value: `{{$env.N8N_API_KEY}}`

---

## Workflow n8n exemple

```
1. [Trigger] - Webhook ou Schedule
2. [HTTP Request] - GET categories (pour récupérer les IDs)
3. [Function] - Préparer les données de l'article
4. [HTTP Request] - POST create article
5. [Success notification] - Email/Slack
```

---

## Statuts des articles

- **`draft`** - Brouillon (non visible publiquement)
- **`approved`** - Approuvé (visible publiquement)
- **`archived`** - Archivé (non visible)

---

## Notes importantes

1. ✅ Le **slug** est auto-généré depuis le titre si non fourni
2. ✅ Le **temps de lecture** est calculé automatiquement (~200 mots/min)
3. ✅ L'**excerpt** est auto-généré depuis le contenu si non fourni
4. ✅ Les **catégories** sont optionnelles mais recommandées
5. ✅ Les **sources** peuvent être ajoutées pour crédibilité
6. ⚠️ La **clé API** doit être gardée secrète
7. ⚠️ Utilisez **HTTPS** en production

---

## Sécurité

- La clé API est vérifiée pour chaque requête POST
- Les requêtes GET sont publiques (ou optionnellement protégées)
- Gardez votre `N8N_API_KEY` secrète et ne la commitez jamais dans Git
- Ajoutez `.env` dans `.gitignore`

---

## Troubleshooting

**Erreur 401:** Vérifiez que le header `X-API-Key` est présent et correct

**Erreur 400:** Vérifiez que `title` et `content` sont présents

**Erreur 500:** Vérifiez les logs serveur et la connexion Supabase

**Slug en doublon:** Supabase retournera une erreur si le slug existe déjà
