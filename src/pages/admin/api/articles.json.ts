import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

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
        categories:article_categories(category:categories(name, slug)),
        sources(name, url, type)
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
    const formData = await request.formData();

    const title = formData.get('title') as string;
    const slug = formData.get('slug') as string;
    const description = formData.get('description') as string;
    const content = formData.get('content') as string;
    const categoryIds = JSON.parse(formData.get('categoryIds') as string || '[]');
    const sources = JSON.parse(formData.get('sources') as string || '[]');
    const imageType = formData.get('imageType') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const imageFile = formData.get('imageFile') as File;

    if (!title?.trim() || !slug?.trim() || !content?.trim()) {
      return new Response(JSON.stringify({ error: 'Title, slug, and content are required' }), { status: 400 });
    }

    let coverImagePath = null;

    // Handle cover image - either URL or file upload
    if (imageType === 'url' && imageUrl && imageUrl.trim()) {
      // Use provided URL
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
        excerpt: description?.trim() || null, // description du form devient excerpt dans la DB
        content: content.trim(),
        cover_image_path: coverImagePath,
        cover_image_alt: null, // Peut être ajouté plus tard si nécessaire
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Mettre à jour les catégories
    if (categoryIds.length > 0) {
      // Supprimer les catégories existantes
      await supabase
        .from('article_categories')
        .delete()
        .eq('article_id', id);

      // Ajouter les nouvelles catégories
      const categoryInserts = categoryIds.map((categoryId: string) => ({
        article_id: id,
        category_id: categoryId
      }));

      const { error: categoryError } = await supabase
        .from('article_categories')
        .insert(categoryInserts);

      if (categoryError) {
        console.error('Erreur lors de la mise à jour des catégories:', categoryError);
      }
    }

    // Mettre à jour les sources
    if (sources.length > 0) {
      // Supprimer les sources existantes
      await supabase
        .from('sources')
        .delete()
        .eq('article_id', id);

      // Ajouter les nouvelles sources
      const sourceInserts = sources.map((source: any) => ({
        article_id: id,
        name: source.name?.trim() || null,
        url: source.url?.trim() || null,
        type: 'web'
      }));

      const { error: sourceError } = await supabase
        .from('sources')
        .insert(sourceInserts);

      if (sourceError) {
        console.error('Erreur lors de la mise à jour des sources:', sourceError);
      }
    }

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

export const POST: APIRoute = async ({ request, cookies }) => {
  // Vérifier l'authentification
  const sessionCookie = cookies.get('admin_session');
  if (!sessionCookie) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const formData = await request.formData();
    
    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    const content = formData.get('content') as string;
    const sourceName = formData.get('sourceName') as string;
    const sourceUrl = formData.get('sourceUrl') as string;
    const coverImageAlt = formData.get('coverImageAlt') as string;
    const categories = JSON.parse(formData.get('categories') as string || '[]');
    const coverImageUrl = formData.get('coverImageUrl') as string; // New field for URL
    const coverImage = formData.get('coverImage') as File;

    if (!title?.trim() || !excerpt?.trim() || !content?.trim()) {
      return new Response(JSON.stringify({ error: 'Title, excerpt, and content are required' }), { status: 400 });
    }

    // Générer un slug depuis le titre
    const slug = title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let coverImagePath = null;

    // Handle cover image - either URL or file upload
    if (coverImageUrl && coverImageUrl.trim()) {
      // Use provided URL
      coverImagePath = coverImageUrl.trim();
    } else if (coverImage && coverImage.size > 0) {
      // Upload file to Supabase Storage
      if (coverImage.size > 5 * 1024 * 1024) {
        return new Response(JSON.stringify({ error: 'Image trop grande (max 5MB)' }), { status: 400 });
      }

      if (!coverImage.type.startsWith('image/')) {
        return new Response(JSON.stringify({ error: 'Type de fichier non supporté' }), { status: 400 });
      }

      const fileExt = coverImage.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('article-images')
        .upload(fileName, coverImage, {
          contentType: coverImage.type,
          upsert: false
        });

      if (uploadError) {
        console.error('Erreur upload image:', uploadError);
        return new Response(JSON.stringify({ error: 'Erreur lors de l\'upload de l\'image' }), { status: 500 });
      }

      const { data: urlData } = supabase.storage
        .from('article-images')
        .getPublicUrl(fileName);

      coverImagePath = urlData.publicUrl;
    }

    // Créer l'article
    const { data: article, error } = await supabase
      .from('articles')
      .insert({
        title: title.trim(),
        slug,
        excerpt: excerpt.trim(),
        content: content.trim(),
        cover_image_path: coverImagePath,
        cover_image_alt: coverImageAlt || null,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;

    // Ajouter la source si elle existe
    if (sourceUrl?.trim()) {
      const { error: sourceError } = await supabase
        .from('sources')
        .insert({
          article_id: article.id,
          name: sourceName?.trim() || null,
          url: sourceUrl.trim(),
          type: 'web'
        });

      if (sourceError) {
        console.error('Erreur lors de l\'ajout de la source:', sourceError);
        // Ne pas échouer pour autant
      }
    }

    // Ajouter les catégories si elles existent
    if (categories.length > 0) {
      // Vérifier que les catégories existent
      const { data: existingCategories, error: checkError } = await supabase
        .from('categories')
        .select('id')
        .in('id', categories);

      if (checkError) {
        console.error('Erreur lors de la vérification des catégories:', checkError);
        return new Response(JSON.stringify({ error: 'Erreur lors de la vérification des catégories' }), { status: 500 });
      }

      if (!existingCategories || existingCategories.length !== categories.length) {
        return new Response(JSON.stringify({ error: 'Une ou plusieurs catégories n\'existent pas' }), { status: 400 });
      }

      const categoryInserts = categories.map((categoryId: string) => ({
        article_id: article.id,
        category_id: categoryId
      }));

      const { error: categoryError } = await supabase
        .from('article_categories')
        .insert(categoryInserts);

      if (categoryError) {
        console.error('Erreur lors de l\'ajout des catégories:', categoryError);
        return new Response(JSON.stringify({ error: 'Erreur lors de l\'ajout des catégories' }), { status: 500 });
      }
    }

    return new Response(JSON.stringify({ article }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Erreur POST article:', error);
    return new Response(JSON.stringify({ error: 'Failed to create article' }), { status: 500 });
  }
};