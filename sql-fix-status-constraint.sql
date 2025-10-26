-- ============================================
-- Vérifier et corriger la contrainte status
-- ============================================

-- 1. Voir la contrainte actuelle
SELECT 
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'articles'::regclass
  AND contype = 'c';

-- 2. Supprimer l'ancienne contrainte (si elle existe)
ALTER TABLE articles
DROP CONSTRAINT IF EXISTS articles_status_check;

-- 3. Créer une nouvelle contrainte avec les bons statuts
ALTER TABLE articles
ADD CONSTRAINT articles_status_check 
CHECK (status IN ('draft', 'approved', 'pending', 'archived'));

-- 4. Vérification
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'articles' AND column_name = 'status';
