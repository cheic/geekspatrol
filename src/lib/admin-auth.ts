import { supabase } from '../lib/supabase';
import crypto from 'crypto';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  is_super_admin: boolean;
  is_active: boolean;
}

// Hasher le mot de passe avec SHA-256 (comme dans Next.js)
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password, 'utf8').digest('hex');
}

// Comparaison sécurisée à temps constant
function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  try {
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export async function loginAdmin(formData: FormData): Promise<AdminUser> {
  const email = formData.get('login') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    throw new Error('Veuillez remplir tous les champs.');
  }

  // Recherche de l'admin dans la table 'admins'
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('email', email.toLowerCase())
    .maybeSingle();

  if (error) {
    throw new Error(`Erreur de base de données: ${error.message}`);
  }

  if (!data) {
    throw new Error('Admin introuvable - Vérifiez les RLS policies dans Supabase');
  }

  // Vérifier si l'admin est actif
  if (data.is_active === false) {
    throw new Error('Compte désactivé');
  }

  // Vérification du mot de passe avec SHA-256 (comme Next.js)
  const hashedPassword = hashPassword(password);
  
  if (!timingSafeEqual(hashedPassword, data.password_hash)) {
    throw new Error('Mot de passe incorrect');
  }

  return {
    id: data.id,
    email: data.email,
    full_name: data.full_name,
    is_super_admin: data.is_super_admin,
    is_active: data.is_active,
  };
}