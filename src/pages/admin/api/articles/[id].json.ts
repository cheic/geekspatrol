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
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'Article ID is required' }), { status: 400 });
    }

    const formData = await request.formData();

    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    
    // Parser les JSON avec gestion d'erreur
    let categoryIds: string[] = [];
    let sources: any[] = [];
    
    try {
      const categoryIdsStr = formData.get('categoryIds') as string;
      if (categoryIdsStr && categoryIdsStr.trim()) {
        categoryIds = JSON.parse(categoryIdsStr);
      }
    } catch (e) {
    }
    
    try {
      const sourcesStr = formData.get('sources') as string;
      if (sourcesStr && sourcesStr.trim()) {
        sources = JSON.parse(sourcesStr);
      }
    } catch (e) {
    }

    const imageType = formData.get('imageType') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const imageFile = formData.get('imageFile') as File;

    if (!title?.trim() || !slug?.trim() || !content?.trim()) {
      return new Response(JSON.stringify({ error: 'Title, slug, and content are required' }), { status: 400 });
    }

    let coverImagePath = null;

    // Handle cover image - either URL or file upload
    if (imageType === 'url' && imageUrl && imageUrl.trim()) {
      coverImagePath = imageUrl.trim();
    } else if (imageType === 'file' && imageFile && imageFile.size > 0) {
      // Upload file to Supabase Storage
      if (imageFile.size > 5 * 1024 * 1024) {
        return new Response(JSON.stringify({ error: 'Image trop grande (max 5MB)' }), { status: 400 });
      }

      if (!imageFile.type.startsWith('image/')) {
        return new Response(JSON.stringify({ error: 'Type de fichier non supporté' }), { status: 400 });
      }

      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(fileName, imageFile, {
          contentType: imageFile.type,
          upsert: false
        });

      if (uploadError) throw uploadError;
      coverImagePath = uploadData.path;
    }

    // Mise à jour de l'article
    const { data: article, error } = await supabase
      .from('articles')
      .update({
        title: title.trim(),
        slug: slug.trim(),
        excerpt: description?.trim() || null,
        content: content.trim(),
        cover_image_path: coverImagePath,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Supprimer les anciennes catégories
    await supabase
      .from('article_categories')
      .delete()
      .eq('article_id', id);

    // Ajouter les nouvelles catégories
    if (categoryIds.length > 0) {
      const articleCategories = categoryIds.map((categoryId: string) => ({
        article_id: id,
        category_id: categoryId
      }));

      const { error: categoriesError } = await supabase
        .from('article_categories')
        .insert(articleCategories);

      if (categoriesError) throw categoriesError;
    }

    // Supprimer les anciennes sources
    await supabase
      .from('sources')
      .delete()
      .eq('article_id', id);

    // Ajouter les nouvelles sources
    if (sources.length > 0) {
      const articleSources = sources.map((source: any) => ({
        article_id: id,
        name: source.name,
        url: source.url,
        type: source.type || 'article'
      }));

      const { error: sourcesError } = await supabase
        .from('sources')
        .insert(articleSources);

      if (sourcesError) throw sourcesError;
    }

    return new Response(JSON.stringify({ 
      success: true,
      article 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Internal Server Error' 
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
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
    return new Response(JSON.stringify({ error: 'Failed to update article' }), { status: 500 });
  }
};