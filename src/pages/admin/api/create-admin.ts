import { supabase } from '../../../lib/supabase';

export async function POST({ request }: { request: Request }) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email et mot de passe requis' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Créer un compte utilisateur
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Erreur lors de la création du compte:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Compte admin créé avec succès:', data.user?.email);

    return new Response(JSON.stringify({
      success: true,
      message: 'Compte admin créé avec succès',
      user: data.user
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erreur serveur:', error);
    return new Response(JSON.stringify({ error: 'Erreur serveur' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}