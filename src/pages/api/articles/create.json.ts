import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ request }) => {
  try {
    // Vérifier l'authentification par clé API
    const apiKey = request.headers.get('X-API-Key');
    const expectedApiKey = import.meta.env.N8N_API_KEY;

    if (!apiKey || apiKey !== expectedApiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'Non autorisé - Clé API invalide ou manquante' 
        }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Parser le corps de la requête
    const body = await request.json();
    
    // Validation des champs requis
    const requiredFields = ['title', 'content'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return new Response(
        JSON.stringify({ 
          error: `Champs requis manquants: ${missingFields.join(', ')}` 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Générer un slug si non fourni
    const slug = body.slug || body.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Calculer le temps de lecture si non fourni (environ 200 mots/minute)
    const wordCount = body.content.replace(/<[^>]*>/g, '').split(/\s+/).filter((w: string) => w.length > 0).length;
    const readingTime = body.reading_time || Math.ceil(wordCount / 200);

    // Déterminer l'author_id
    // Si fourni explicitement, on l'utilise
    // Sinon, on utilise l'ID de l'auteur "n8n Bot" par défaut depuis .env
    // Si pas dans .env, on laisse null
    const N8N_DEFAULT_AUTHOR_ID = import.meta.env.N8N_DEFAULT_AUTHOR_ID || null;
    const authorId = body.author_id || N8N_DEFAULT_AUTHOR_ID;

    // Préparer les données de l'article
    const articleData: any = {
      title: body.title,
      slug: slug,
      content: body.content,
      excerpt: body.excerpt || body.content.substring(0, 200).replace(/<[^>]*>/g, '') + '...',
      cover_image_path: body.cover_image_path || null,
      cover_image_alt: body.cover_image_alt || body.title,
      status: 'draft', // Les articles de l'API sont en attente de validation par défaut
    };

    // Ajouter reading_time seulement si la colonne existe
    if (readingTime > 0) {
      articleData.reading_time = readingTime;
    }

    // Ajouter author_id seulement si fourni et si la colonne existe
    if (authorId) {
      articleData.author_id = authorId;
    }

    // Insérer l'article dans Supabase
    const { data: article, error: articleError } = await supabase
      .from('articles')
      .insert([articleData])
      .select()
      .single();

    if (articleError) {
      return new Response(
        JSON.stringify({ 
          error: 'Erreur lors de la création de l\'article',
          details: articleError.message 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Associer les catégories si fournies
    if (body.category_ids && Array.isArray(body.category_ids) && body.category_ids.length > 0) {
      const categoryAssociations = body.category_ids.map((categoryId: number) => ({
        article_id: article.id,
        category_id: categoryId
      }));

      const { error: categoryError } = await supabase
        .from('article_categories')
        .insert(categoryAssociations);

      if (categoryError) {
        // On continue quand même, l'article est créé
      }
    }

    // Associer les sources si fournies
    if (body.sources && Array.isArray(body.sources) && body.sources.length > 0) {
      const sourceInserts = body.sources.map((source: { name: string; url: string }) => ({
        article_id: article.id,
        name: source.name,
        url: source.url
      }));

      const { error: sourceError } = await supabase
        .from('sources')
        .insert(sourceInserts);

      if (sourceError) {
        // On continue quand même
      }
    }

    // Récupérer l'article complet avec les relations
    const { data: fullArticle } = await supabase
      .from('articles')
      .select(`
        *,
        article_categories(category_id, category:categories(id, name, slug)),
        sources(id, name, url)
      `)
      .eq('id', article.id)
      .single();

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Article créé avec succès',
        article: fullArticle 
      }),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'Erreur serveur',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
