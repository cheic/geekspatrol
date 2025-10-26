import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const GET: APIRoute = async ({ url }) => {
  const query = url.searchParams.get('q') || '';
  
  if (!query || query.length < 2) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  try {
    // Recherche dans les articles
    const { data: articles, error } = await supabase
      .from('articles')
      .select(`
        id,
        title,
        slug,
        excerpt,
        cover_image_path,
        cover_image_alt,
        reading_time,
        created_at,
        article_categories(
          category_id,
          category:categories(id, name, slug)
        )
      `)
      .eq('status', 'approved')
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%`)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Supabase search error:', error);
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Formater les résultats
    const results = articles?.map(article => {
      const firstCat = article.article_categories?.[0];
      const category = firstCat?.category ? (Array.isArray(firstCat.category) ? firstCat.category[0] : firstCat.category) : null;
      
      return {
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        cover_image_path: article.cover_image_path,
        cover_image_alt: article.cover_image_alt,
        reading_time: article.reading_time,
        category: category?.name || null,
        url: category ? `/${category.slug}/${article.slug}` : `/${article.slug}`
      };
    }) || [];

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    return new Response(JSON.stringify([]), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
