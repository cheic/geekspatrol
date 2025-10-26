// Navigation configuration
export interface NavItem {
  label: string;
  href?: string;
  external?: boolean;
  description?: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { 
    label: 'Actualités', 
    href: '/blog',
    description: 'Toute l\'actualité tech et numérique'
  },
  { 
    label: 'Intelligence Artificielle', 
    href: '/blog/category/ia',
    description: 'IA, machine learning et technologies émergentes'
  },
  { 
    label: 'Mobile', 
    href: '/blog/category/mobile',
    description: 'Smartphones, tablettes et applications'
  },
  { 
    label: 'Tech & Gadgets', 
    href: '/blog/category/tech',
    description: 'Hardware, logiciels, innovations et voitures électriques'
  },
];

// Navigation secondaire - pour futures implémentations
export const SECONDARY_NAV: NavItem[] = [
  // { label: 'Pour vous', href: '/personalized' },
  // { label: 'Guides', href: '/guides' },
  // { label: 'Podcast', href: '/podcast' },
  // { label: 'Communauté', href: '/community' },
  // { label: 'Contribuer', href: '/contribute' },
];

export const buildHref = (item: NavItem): string => {
  if (item.external) {
    return item.href || '#';
  }
  return item.href || '#';
};
