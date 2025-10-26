export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  slug: string;
  status: ArticleStatus;
  created_at: string;
  updated_at: string;
  published_at?: string;
  cover_image_path: string | null;
  cover_image_alt: string | null;
  image_url?: string;
  category?: string;
  reading_time?: number;
  author?: string;
  meta_description?: string;
  tags?: string[];
  featured?: boolean;
}

export type ArticleStatus = 'pending' | 'approved' | 'rejected';

export interface SupabaseArticleRow {
  id: string;
  title: string;
  content?: string | null;
  excerpt?: string | null;
  slug: string;
  status?: ArticleStatus;
  created_at: string;
  updated_at?: string | null;
  cover_image_path?: string | null;
  cover_image_alt?: string | null;
  image_url?: string | null;
  reading_time?: number | null;
  categories?: Array<{
    category?: Array<{
      name?: string | null;
      slug?: string | null;
    } | null> | null;
  } | null> | null;
}