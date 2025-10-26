-- ============================================
-- SQL pour ajouter author_id à la table articles
-- ============================================

-- 1. Créer la table authors (si elle n'existe pas déjà)
CREATE TABLE IF NOT EXISTS authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Insérer l'auteur "n8n Automation" avec UUID fixe
INSERT INTO authors (id, name, email, bio, avatar_url)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'n8n Automation',
  'automation@geekspatrol.com',
  'Articles générés automatiquement via n8n et workflows d''automatisation',
  '/images/avatars/n8n-bot.png'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Ajouter les colonnes author_id et reading_time à la table articles
ALTER TABLE articles
ADD COLUMN IF NOT EXISTS author_id UUID REFERENCES authors(id);

ALTER TABLE articles
ADD COLUMN IF NOT EXISTS reading_time INTEGER;

-- 3b. Corriger la contrainte status pour accepter draft/pending/approved/archived
ALTER TABLE articles
DROP CONSTRAINT IF EXISTS articles_status_check;

ALTER TABLE articles
ADD CONSTRAINT articles_status_check 
CHECK (status IN ('draft', 'pending', 'approved', 'archived'));

-- 4. Créer un index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_articles_author_id ON articles(author_id);

-- 5. (Optionnel) Mettre à jour les articles existants avec l'auteur par défaut
-- Décommentez cette ligne si vous voulez associer tous les articles existants à n8n Bot
-- UPDATE articles SET author_id = '00000000-0000-0000-0000-000000000001' WHERE author_id IS NULL;

-- ============================================
-- Vérification
-- ============================================

-- Vérifier que l'auteur a été créé
SELECT * FROM authors WHERE id = '00000000-0000-0000-0000-000000000001';

-- Vérifier la structure de la table articles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'articles' AND column_name = 'author_id';
