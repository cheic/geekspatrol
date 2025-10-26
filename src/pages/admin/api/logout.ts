import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  try {
    // Déconnexion de Supabase
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }

    // Supprimer le cookie de session
    cookies.delete('admin_session', { path: '/' });

    // Redirection vers la page de connexion
    return redirect('/admin/login?message=logged_out');

  } catch (error) {
    console.error('Erreur serveur lors de la déconnexion:', error);
    return redirect('/admin/login?error=logout_failed');
  }
};