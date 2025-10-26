# 👤 Configuration des auteurs (Author ID) pour l'API n8n

## 🎯 Objectif

Associer automatiquement un auteur aux articles créés via l'API n8n pour tracer leur provenance.

---

## 📋 Prérequis : Créer la table `authors` dans Supabase

### Option 1 : Via l'interface Supabase

1. Allez dans **Table Editor** dans Supabase
2. Créez une nouvelle table `authors` :

```sql
CREATE TABLE authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

3. Insérez un auteur "n8n Bot" par défaut :

```sql
INSERT INTO authors (id, name, email, bio, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'n8n Automation',
  'automation@geekspatrol.com',
  'Articles générés automatiquement via n8n',
  '/images/avatars/n8n-bot.png'
);
```

4. Ajoutez la colonne `author_id` à la table `articles` si elle n'existe pas :

```sql
ALTER TABLE articles
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES authors(id);
```

---

## 🔗 Liaison dans l'API

### 1. Configuration dans `.env`

Ajoutez l'ID de l'auteur par défaut pour n8n :

```env
# ID de l'auteur n8n Bot (UUID)
N8N_DEFAULT_AUTHOR_ID=00000000-0000-0000-0000-000000000001
```

### 2. Utilisation dans l'API

L'API gère automatiquement l'`author_id` :

```typescript
// Si author_id est fourni dans la requête, il est utilisé
// Sinon, null (peut être modifié pour utiliser N8N_DEFAULT_AUTHOR_ID)
const authorId = body.author_id || null;
```

---

## 📝 Exemples d'utilisation

### Exemple 1 : Article avec auteur par défaut (n8n Bot)

```bash
curl -X POST http://localhost:4321/api/articles/create.json \
  -H "Content-Type: application/json" \
  -H "X-API-Key: VOTRE_CLE" \
  -d '{
    "title": "Article automatique",
    "content": "<p>Créé par n8n</p>",
    "author_id": "00000000-0000-0000-0000-000000000001"
  }'
```

### Exemple 2 : Article sans auteur (null)

```bash
curl -X POST http://localhost:4321/api/articles/create.json \
  -H "Content-Type: application/json" \
  -H "X-API-Key: VOTRE_CLE" \
  -d '{
    "title": "Article automatique",
    "content": "<p>Sans auteur spécifique</p>"
  }'
```

### Exemple 3 : Workflow n8n avec auteur

```json
{
  "title": "{{$json.title}}",
  "content": "{{$json.content}}",
  "author_id": "00000000-0000-0000-0000-000000000001",
  "status": "approved"
}
```

---

## 🎨 Créer d'autres auteurs

### Auteur humain (rédacteur)

```sql
INSERT INTO authors (name, email, bio, avatar_url)
VALUES (
  'John Doe',
  'john@geekspatrol.com',
  'Rédacteur tech passionné d''IA et de gadgets',
  '/images/avatars/john-doe.jpg'
);
```

### Auteur IA (ChatGPT)

```sql
INSERT INTO authors (id, name, email, bio, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'AI Writer (GPT-4)',
  'ai@geekspatrol.com',
  'Articles générés par intelligence artificielle',
  '/images/avatars/ai-bot.png'
);
```

### Auteur RSS Feed

```sql
INSERT INTO authors (id, name, email, bio, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000003',
  'RSS Aggregator',
  'rss@geekspatrol.com',
  'Articles importés depuis flux RSS',
  '/images/avatars/rss-bot.png'
);
```

---

## 🔄 Modifier l'API pour utiliser un auteur par défaut

### Option 1 : Auteur par défaut dans l'API

Modifiez `/src/pages/api/articles/create.json.ts` :

```typescript
// Utiliser l'auteur n8n par défaut si aucun auteur n'est fourni
const N8N_DEFAULT_AUTHOR_ID = '00000000-0000-0000-0000-000000000001';
const authorId = body.author_id || N8N_DEFAULT_AUTHOR_ID;
```

### Option 2 : Auteur par défaut depuis .env

```typescript
const N8N_DEFAULT_AUTHOR_ID = import.meta.env.N8N_DEFAULT_AUTHOR_ID || null;
const authorId = body.author_id || N8N_DEFAULT_AUTHOR_ID;
```

---

## 📊 Récupérer les auteurs disponibles

### Créer un endpoint GET /api/authors/list.json

```typescript
// src/pages/api/authors/list.json.ts
import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async () => {
  const { data: authors, error } = await supabase
    .from('authors')
    .select('id, name, email, bio, avatar_url')
    .order('name', { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ 
    success: true, 
    authors: authors || [] 
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
```

### Utilisation

```bash
curl http://localhost:4321/api/authors/list.json
```

Réponse :
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

## 🎯 Workflows n8n recommandés

### Workflow 1 : Auteur dynamique basé sur la source

```javascript
// Node "Determine Author" (Function)
const sourceUrl = $json.source_url;
let authorId;

if (sourceUrl.includes('techcrunch.com')) {
  authorId = 'UUID_RSS_BOT';
} else if (sourceUrl.includes('openai.com')) {
  authorId = 'UUID_AI_BOT';
} else {
  authorId = 'UUID_N8N_BOT'; // Par défaut
}

return {
  ...input.json,
  author_id: authorId
};
```

### Workflow 2 : Auteur fixe pour tout n8n

```json
{
  "title": "{{$json.title}}",
  "content": "{{$json.content}}",
  "author_id": "00000000-0000-0000-0000-000000000001"
}
```

---

## 📈 Afficher l'auteur dans les articles

### Modifier ArticleCard.tsx

```tsx
{article.author && (
  <div className="flex items-center gap-2 text-sm text-slate-500">
    {article.author.avatar_url && (
      <img 
        src={article.author.avatar_url} 
        alt={article.author.name}
        className="w-6 h-6 rounded-full"
      />
    )}
    <span>Par {article.author.name}</span>
  </div>
)}
```

### Query Supabase avec auteur

```typescript
const { data: articles } = await supabase
  .from('articles')
  .select(`
    *,
    author:authors(id, name, avatar_url),
    article_categories(category:categories(*))
  `)
  .eq('status', 'approved');
```

---

## 🔍 Statistiques par auteur

```sql
-- Nombre d'articles par auteur
SELECT 
  a.name,
  COUNT(ar.id) as article_count
FROM authors a
LEFT JOIN articles ar ON a.id = ar.author_id
GROUP BY a.id, a.name
ORDER BY article_count DESC;
```

---

## ✅ Checklist de configuration

- [ ] Créer la table `authors` dans Supabase
- [ ] Insérer l'auteur "n8n Automation"
- [ ] Ajouter la colonne `author_id` à `articles`
- [ ] Ajouter `N8N_DEFAULT_AUTHOR_ID` dans `.env`
- [ ] Modifier l'API pour utiliser l'auteur par défaut
- [ ] Créer l'endpoint `/api/authors/list.json` (optionnel)
- [ ] Tester la création d'article avec `author_id`
- [ ] Afficher l'auteur dans les cartes d'articles
- [ ] Mettre à jour les workflows n8n

---

## 🎨 IDs d'auteurs recommandés

| Auteur | UUID suggéré | Usage |
|--------|-------------|-------|
| n8n Automation | `00000000-0000-0000-0000-000000000001` | Articles automatiques n8n |
| AI Writer (GPT-4) | `00000000-0000-0000-0000-000000000002` | Articles IA |
| RSS Aggregator | `00000000-0000-0000-0000-000000000003` | Flux RSS |
| Équipe Éditoriale | `00000000-0000-0000-0000-000000000004` | Articles humains |

---

## 📝 Exemple complet

```bash
# 1. Créer l'auteur n8n
curl -X POST https://your-supabase-url/rest/v1/authors \
  -H "apikey: YOUR_KEY" \
  -d '{
    "id": "00000000-0000-0000-0000-000000000001",
    "name": "n8n Automation",
    "email": "automation@geekspatrol.com"
  }'

# 2. Créer un article avec cet auteur
curl -X POST http://localhost:4321/api/articles/create.json \
  -H "X-API-Key: YOUR_KEY" \
  -d '{
    "title": "Test Article",
    "content": "<p>Content</p>",
    "author_id": "00000000-0000-0000-0000-000000000001"
  }'
```

---

**✨ Votre API est maintenant prête à gérer les auteurs !**
