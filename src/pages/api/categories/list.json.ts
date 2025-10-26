import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const GET: APIRoute = async ({ request }) => {
  try {
    // Vérifier l'authentification par clé API (optionnel pour GET)
    const apiKey = request.headers.get('X-API-Key');
    const expectedApiKey = import.meta.env.N8N_API_KEY;

    if (apiKey && apiKey !== expectedApiKey) {
      return new Response(
        JSON.stringify({ 
          error: 'Non autorisé - Clé API invalide' 
        }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Récupérer toutes les catégories
    const { data: categories, error } = await supabase
      .from('categories')
      .select('id, name, slug, description')
      .order('name', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Erreur lors de la récupération des catégories',
          details: error.message 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        categories: categories || []
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Erreur API:', error);
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
