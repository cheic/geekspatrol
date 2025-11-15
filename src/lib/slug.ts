// Utilitaire centralisé pour mapper les slugs de base de données vers les slugs d'URL
export function mapCategorySlug(dbSlug: string): string {
  const slugMapping: Record<string, string> = {
    'ia-machine-learning': 'ia',
    'intelligence-artificielle': 'ia',
    'ai': 'ia',
    'machine-learning': 'ia',
    'smartphones': 'mobile',
    'mobile': 'mobile',
    'telephones': 'mobile',
    'tech-gadgets': 'tech',
    'hardware': 'tech',
    'innovation': 'tech',
    'voitures-electriques': 'tech',
    'tech': 'tech'
  };
  return slugMapping[dbSlug] || dbSlug;
}

export const CATEGORY_DISPLAY: Record<string, { title: string; description: string }> = {
  ia: {
    title: 'Intelligence Artificielle',
    description: 'IA, machine learning et technologies émergentes'
  },
  mobile: {
    title: 'Mobile',
    description: 'Smartphones, tablettes et applications'
  },
  tech: {
    title: 'Tech & Gadgets',
    description: 'Hardware, logiciels, innovations et voitures électriques'
  }
};