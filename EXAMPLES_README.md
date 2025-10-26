# 📝 Exemples de création d'articles via l'API

Ce dossier contient des exemples pratiques pour créer des articles via l'API GeeksPatrol dans différents langages.

## 🚀 Scripts disponibles

### 1. Bash/cURL (`example-create-article.sh`)

**Utilisation :**
```bash
./example-create-article.sh
```

**Prérequis :**
- `curl`
- `jq` (pour le formatage JSON) : `brew install jq`

**Ce que fait le script :**
1. Récupère la liste des catégories disponibles
2. Crée un article complet sur ChatGPT 5
3. Affiche la réponse JSON formatée
4. Donne l'URL de l'article créé

---

### 2. Python (`example-create-article.py`)

**Utilisation :**
```bash
python3 example-create-article.py
# ou
./example-create-article.py
```

**Prérequis :**
- Python 3.7+
- `requests` library : `pip install requests`

**Ce que fait le script :**
1. Récupère les catégories
2. Crée un article sur les smartphones pliables 2025
3. Gestion d'erreurs complète
4. Affichage formaté des résultats

---

### 3. Node.js/JavaScript (`example-create-article.js`)

**Utilisation :**
```bash
node example-create-article.js
# ou
./example-create-article.js
```

**Prérequis :**
- Node.js 18+ (pour fetch natif)

**Ce que fait le script :**
1. Récupère les catégories
2. Crée un article sur les tendances tech 2025
3. Utilise fetch natif (pas de dépendances)
4. Async/await moderne

---

## 📊 Structure d'un article complet

```json
{
  "title": "Titre de l'article",          // REQUIS
  "content": "<p>Contenu HTML...</p>",    // REQUIS
  "excerpt": "Résumé court",              // Auto-généré si absent
  "slug": "titre-article",                // Auto-généré si absent
  "status": "approved",                   // "draft", "approved", "archived"
  "cover_image_path": "/images/cover.jpg",
  "cover_image_alt": "Description image",
  "category_ids": ["uuid-1", "uuid-2"],   // UUIDs des catégories
  "sources": [
    {
      "name": "Source 1",
      "url": "https://example.com"
    }
  ]
}
```

---

## 🎯 Catégories disponibles

Récupérez les catégories avec :

```bash
curl http://localhost:4321/api/categories/list.json
```

**Catégories actuelles :**
- IA & Machine Learning (`ia-machine-learning`)
- Mobile (`mobile`)
- Technologie (`technologie`)
- Gaming (`gaming`)
- Science (`science`)
- etc.

---

## 🔑 Configuration

Tous les scripts utilisent la clé API définie dans `.env` :

```env
N8N_API_KEY=6T941FIFyj/zyAzApBD0Qw/hIejqUGxZo2S6GVQXYQ4=
```

**⚠️ Changez cette clé en production !**

---

## ✅ Tester rapidement

```bash
# Test simple avec curl
curl -X POST http://localhost:4321/api/articles/create.json \
  -H "Content-Type: application/json" \
  -H "X-API-Key: 6T941FIFyj/zyAzApBD0Qw/hIejqUGxZo2S6GVQXYQ4=" \
  -d '{
    "title": "Article de test",
    "content": "<p>Ceci est un test</p>",
    "status": "draft"
  }'
```

---

## 📝 Exemples d'articles créés

### Exemple 1 : Article tech avec IA
```bash
./example-create-article.sh
```
**Crée :** Article sur ChatGPT 5 avec sources, SEO, catégorie IA

### Exemple 2 : Article mobile avec comparatif
```bash
python3 example-create-article.py
```
**Crée :** Comparatif smartphones pliables 2025 avec tableau

### Exemple 3 : Article tendances
```bash
node example-create-article.js
```
**Crée :** Tendances tech 2025 avec liste ordonnée

---

## 🐛 Dépannage

### Erreur 401 (Non autorisé)
```
✅ Vérifiez que la clé API est correcte
✅ Vérifiez que le header X-API-Key est présent
```

### Erreur 400 (Requête invalide)
```
✅ Vérifiez que title et content sont présents
✅ Vérifiez que le JSON est valide
```

### Erreur 500 (Erreur serveur)
```
✅ Vérifiez que le serveur Astro est démarré
✅ Regardez les logs du serveur
✅ Vérifiez la connexion Supabase
```

### Catégories introuvables
```bash
# Vérifiez que l'API fonctionne
curl http://localhost:4321/api/categories/list.json

# Si vide, créez des catégories dans Supabase
```

---

## 🎨 Personnalisation

### Modifier l'URL de l'API

Dans chaque script, changez :
```bash
API_URL="http://localhost:4321"  # Development
# vers
API_URL="https://geekspatrol.com"  # Production
```

### Modifier la clé API

```bash
API_KEY="votre_nouvelle_clé"
```

### Créer vos propres articles

Copiez un des scripts et modifiez :
- `title` : Le titre de votre article
- `content` : Le contenu HTML
- `category_ids` : Les UUIDs des catégories
- `sources` : Vos sources
- `status` : `draft` ou `approved`

---

## 📚 Documentation complète

- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Doc API complète
- [API_README.md](./API_README.md) - Guide rapide
- [test-api.sh](./test-api.sh) - Script de tests automatisés

---

## 💡 Conseils

1. **Toujours tester en draft** : Créez d'abord avec `"status": "draft"` pour vérifier
2. **Valider le HTML** : Le contenu doit être du HTML valide
3. **Optimiser le SEO** : Remplissez seo_title, seo_description
4. **Ajouter des sources** : Améliore la crédibilité
5. **Choisir les bonnes catégories** : Important pour la navigation

---

## 🚀 Prochaines étapes

1. Créez vos propres articles en modifiant les exemples
2. Intégrez avec n8n (voir `n8n-workflow-example.json`)
3. Automatisez la publication depuis RSS, IA, etc.
4. Configurez des webhooks pour notifier les publications

---

**Créé avec ❤️ pour GeeksPatrol**
