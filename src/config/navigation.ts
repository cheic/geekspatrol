// Navigation configuration
export interface NavItem {
  label: string;
  href?: string;
  external?: boolean;
}

export const PRIMARY_NAV: NavItem[] = [
  { label: 'Accueil', href: '/' },
  { label: 'IA', href: '/blog' },
  { label: 'Mobile', href: '/mobile' },
    { label: 'Plus', href: '/SECONDARY_NAV' },
];

export const SECONDARY_NAV: NavItem[] = [
  { label: 'À propos', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export const buildHref = (item: NavItem): string => {
  if (item.external) {
    return item.href || '#';
  }
  return item.href || '#';
};