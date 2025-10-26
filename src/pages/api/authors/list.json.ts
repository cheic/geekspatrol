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

    // Récupérer tous les auteurs
    const { data: authors, error } = await supabase
      .from('authors')
      .select('id, name, email, bio, avatar_url')
      .order('name', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des auteurs:', error);
      return new Response(
        JSON.stringify({ 
          error: 'Erreur lors de la récupération des auteurs',
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
        authors: authors || []
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
