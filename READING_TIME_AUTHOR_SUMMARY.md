# ✅ Reading Time & Author ID - Implémentation

## 🎯 Problématique résolue

Comment associer automatiquement un `author_id` et calculer le `reading_time` pour les articles créés via l'API n8n ?

**⚠️ Validation obligatoire** : Tous les articles créés via l'API sont automatiquement en statut `draft` et nécessitent une validation manuelle avant publication.

---

## ✨ Solution implémentée

### 1. **Reading Time (Temps de lecture)**

✅ **Calcul automatique** basé sur le nombre de mots (~200 mots/minute)

```typescript
// Extraction du texte (sans HTML)
const wordCount = body.content
  .replace(/<[^>]*>/g, '') // Retire les balises HTML
  .split(/\s+/)             // Sépare par espaces
  .filter((w: string) => w.length > 0) // Filtre les espaces vides
  .length;

// Calcul du temps de lecture
const readingTime = Math.ceil(wordCount / 200); // Arrondi au supérieur
```

**Exemples :**
- 400 mots = 2 minutes
- 1000 mots = 5 minutes
- 1500 mots = 8 minutes

**Override possible :** Vous pouvez passer `reading_time` dans la requête pour forcer une valeur.

---

### 2. **Author ID (ID de l'auteur)**

✅ **Auteur par défaut configurable** via variable d'environnement

```typescript
// 1. Lecture de la variable d'environnement
const N8N_DEFAULT_AUTHOR_ID = import.meta.env.N8N_DEFAULT_AUTHOR_ID || null;

// 2. Utilisation de l'auteur fourni OU de l'auteur par défaut
const authorId = body.author_id || N8N_DEFAULT_AUTHOR_ID;

// 3. Ajout conditionnel (seulement si non-null)
if (authorId) {
  articleData.author_id = authorId;
}
```

**Priorité :**
1. `author_id` fourni dans la requête API
2. `N8N_DEFAULT_AUTHOR_ID` depuis `.env`
3. `null` si rien n'est configuré

---

## 🔧 Configuration requise

### 1. Fichier `.env`

```env
# ID de l'auteur par défaut pour n8n
N8N_DEFAULT_AUTHOR_ID=00000000-0000-0000-0000-000000000001
```

### 2. Créer l'auteur dans Supabase

**SQL à exécuter :**

```sql
-- 1. Créer la table authors (si elle n'existe pas)
CREATE TABLE IF NOT EXISTS authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Insérer l'auteur "n8n Automation"
INSERT INTO authors (id, name, email, bio, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'n8n Automation',
  'automation@geekspatrol.com',
  'Articles générés automatiquement via n8n et workflows d''automatisation',
  '/images/avatars/n8n-bot.png'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Ajouter la colonne author_id à articles (si elle n'existe pas)
ALTER TABLE articles
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES authors(id);

-- 4. Ajouter la colonne reading_time à articles (si elle n'existe pas)
ALTER TABLE articles
ADD COLUMN IF NOT EXISTS reading_time INTEGER;
```

---

## 📡 Nouveaux endpoints

### GET `/api/authors/list.json`

Liste tous les auteurs disponibles.

**Requête :**
```bash
curl http://localhost:4321/api/authors/list.json
```

**Réponse :**
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

## 📝 Exemples d'utilisation

### Exemple 1 : Article avec auteur par défaut

```bash
curl -X POST http://localhost:4321/api/articles/create.json \
  -H "Content-Type: application/json" \
  -H "X-API-Key: VOTRE_CLE" \
  -d '{
    "title": "Article automatique",
    "content": "<p>Un article de 200 mots environ qui prendra 1 minute à lire...</p>"
  }'
```

**Résultat :**
- ✅ `reading_time`: calculé automatiquement (1 min)
- ✅ `author_id`: `00000000-0000-0000-0000-000000000001` (n8n Bot)

---

### Exemple 2 : Article avec auteur spécifique

```bash
curl -X POST http://localhost:4321/api/articles/create.json \
  -H "Content-Type: application/json" \
  -H "X-API-Key: VOTRE_CLE" \
  -d '{
    "title": "Article IA",
    "content": "<p>Article généré par GPT-4...</p>",
    "author_id": "00000000-0000-0000-0000-000000000002"
  }'
```

**Résultat :**
- ✅ `reading_time`: calculé automatiquement
- ✅ `author_id`: `00000000-0000-0000-0000-000000000002` (AI Bot)

---

### Exemple 3 : Forcer le temps de lecture

```bash
curl -X POST http://localhost:4321/api/articles/create.json \
  -H "Content-Type: application/json" \
  -H "X-API-Key: VOTRE_CLE" \
  -d '{
    "title": "Article vidéo",
    "content": "<p>Transcription de vidéo...</p>",
    "reading_time": 10
  }'
```

**Résultat :**
- ✅ `reading_time`: 10 min (forcé)
- ✅ `author_id`: auteur par défaut

---

## 🎨 Auteurs recommandés

| Nom | UUID | Usage |
|-----|------|-------|
| **n8n Automation** | `00000000-0000-0000-0000-000000000001` | Articles via n8n |
| **AI Writer (GPT-4)** | `00000000-0000-0000-0000-000000000002` | Articles générés par IA |
| **RSS Aggregator** | `00000000-0000-0000-0000-000000000003` | Flux RSS importés |
| **Équipe Éditoriale** | `00000000-0000-0000-0000-000000000004` | Articles humains |

**SQL pour créer tous les auteurs :**

```sql
INSERT INTO authors (id, name, email, bio, avatar_url) VALUES
  ('00000000-0000-0000-0000-000000000001', 'n8n Automation', 'automation@geekspatrol.com', 'Articles automatiques via n8n', '/images/avatars/n8n-bot.png'),
  ('00000000-0000-0000-0000-000000000002', 'AI Writer (GPT-4)', 'ai@geekspatrol.com', 'Articles générés par IA', '/images/avatars/ai-bot.png'),
  ('00000000-0000-0000-0000-000000000003', 'RSS Aggregator', 'rss@geekspatrol.com', 'Flux RSS importés', '/images/avatars/rss-bot.png'),
  ('00000000-0000-0000-0000-000000000004', 'Équipe Éditoriale', 'editorial@geekspatrol.com', 'Rédaction humaine', '/images/avatars/team.png')
ON CONFLICT (id) DO NOTHING;
```

---

## 🔄 Workflow n8n avec auteur dynamique

### Scénario : Auteur basé sur la source

```javascript
// Node "Set Author" (Function)
const content = $json.content;
const source = $json.source_url;

let authorId = '00000000-0000-0000-0000-000000000001'; // n8n par défaut

// Détection automatique
if (content.toLowerCase().includes('gpt') || content.toLowerCase().includes('ai')) {
  authorId = '00000000-0000-0000-0000-000000000002'; // AI Writer
} else if (source && source.includes('rss')) {
  authorId = '00000000-0000-0000-0000-000000000003'; // RSS
}

return {
  ...input.json,
  author_id: authorId
};
```

---

## 📊 Statistiques

### Articles par auteur

```sql
SELECT 
  a.name,
  COUNT(ar.id) as total_articles,
  AVG(ar.reading_time) as avg_reading_time
FROM authors a
LEFT JOIN articles ar ON a.id = ar.author_id
GROUP BY a.id, a.name
ORDER BY total_articles DESC;
```

**Résultat attendu :**
```
n8n Automation    | 45 articles | 5 min moyenne
AI Writer (GPT-4) | 12 articles | 7 min moyenne
RSS Aggregator    |  8 articles | 4 min moyenne
```

---

## ✅ Checklist de configuration

### Supabase
- [ ] Créer la table `authors`
- [ ] Insérer les auteurs (n8n, AI, RSS, etc.)
- [ ] Ajouter la colonne `author_id` à `articles`
- [ ] Ajouter la colonne `reading_time` à `articles`

### Backend (API)
- [x] Calcul automatique du `reading_time`
- [x] Support de `author_id` depuis requête
- [x] Support de `N8N_DEFAULT_AUTHOR_ID` depuis `.env`
- [x] Endpoint `/api/authors/list.json`

### Configuration
- [ ] Ajouter `N8N_DEFAULT_AUTHOR_ID` dans `.env`
- [ ] Tester la création d'article avec auteur
- [ ] Tester le calcul du temps de lecture

### n8n
- [ ] Configurer `author_id` dans les workflows
- [ ] Tester les différents types d'auteurs
- [ ] Mettre en place la logique de sélection d'auteur

---

## 📚 Documentation associée

- [AUTHOR_SETUP.md](./AUTHOR_SETUP.md) - Guide complet de configuration des auteurs
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Documentation API mise à jour
- [API_README.md](./API_README.md) - Guide rapide API

---

## 🎉 Résultat final

Votre API gère maintenant automatiquement :

✅ **Reading Time** : Calculé sur ~200 mots/min, personnalisable

✅ **Author ID** : Auteur par défaut configurable, override possible

✅ **Endpoints** : `/api/authors/list.json` pour lister les auteurs

✅ **Flexibilité** : Adaptation automatique selon la source (n8n, IA, RSS)

---

**Prêt pour la production ! 🚀**
