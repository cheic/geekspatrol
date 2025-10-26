import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase';

export const GET: APIRoute = async ({ params, cookies }) => {
  // Vérifier l'authentification
  const sessionCookie = cookies.get('admin_session');
  if (!sessionCookie) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { id } = params;
    
    const { data: article, error } = await supabase
      .from('articles')
      .select(`
        id, title, slug, excerpt, content, status, created_at, updated_at,
        cover_image_path, cover_image_alt,
        categories:article_categories(category:categories(name, slug))
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ article }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erreur GET article:', error);
    return new Response(JSON.stringify({ error: 'Article not found' }), { status: 404 });
  }
};

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  // Vérifier l'authentification
  const sessionCookie = cookies.get('admin_session');
  if (!sessionCookie) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { id } = params;
    const body = await request.json();
    const { title, excerpt, content, cover_image_path, cover_image_alt } = body;

    // Mise à jour de l'article (sans changer le statut)
    const { data: article, error } = await supabase
      .from('articles')
      .update({
        title: title?.trim(),
        excerpt: excerpt?.trim(),
        content: content?.trim(),
        cover_image_path: cover_image_path || null,
        cover_image_alt: cover_image_alt || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ article }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erreur PUT article:', error);
    return new Response(JSON.stringify({ error: 'Failed to update article' }), { status: 500 });
  }
};

export const PATCH: APIRoute = async ({ params, request, cookies }) => {
  // Vérifier l'authentification
  const sessionCookie = cookies.get('admin_session');
  if (!sessionCookie) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { id } = params;
    const body = await request.json();
    const { action } = body;

    let newStatus: string;
    let updateData: any = { updated_at: new Date().toISOString() };

    switch (action) {
      case 'approve':
        // Validation avant approbation
        const { data: currentArticle } = await supabase
          .from('articles')
          .select('title, content, excerpt, slug')
          .eq('id', id)
          .single();

        if (!currentArticle?.title?.trim()) {
          return new Response(JSON.stringify({ error: 'Article title is required for approval' }), { status: 400 });
        }
        if (!currentArticle?.content?.trim()) {
          return new Response(JSON.stringify({ error: 'Article content is required for approval' }), { status: 400 });
        }
        if (!currentArticle?.excerpt?.trim()) {
          return new Response(JSON.stringify({ error: 'Article excerpt is required for approval' }), { status: 400 });
        }

        // Vérifier l'unicité du slug
        const { data: existingSlug } = await supabase
          .from('articles')
          .select('id')
          .eq('slug', currentArticle.slug)
          .neq('id', id)
          .eq('status', 'approved')
          .single();

        if (existingSlug) {
          return new Response(JSON.stringify({ error: 'Slug must be unique among approved articles' }), { status: 400 });
        }

        newStatus = 'approved';
        break;

      case 'reject':
        newStatus = 'rejected';
        break;

      case 'unpublish':
        newStatus = 'pending';
        break;

      case 'delete':
        // Suppression
        const { error: deleteError } = await supabase
          .from('articles')
          .delete()
          .eq('id', id);

        if (deleteError) throw deleteError;

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
    }

    // Mise à jour du statut
    const { data: article, error } = await supabase
      .from('articles')
      .update({ ...updateData, status: newStatus })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ article }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erreur PATCH article:', error);
    return new Response(JSON.stringify({ error: 'Failed to update article' }), { status: 500 });
  }
};