// Google Analytics utilities
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const GA_EVENTS = {
  // Articles
  ARTICLE_VIEW: 'article_view',
  ARTICLE_SHARE: 'article_share',
  ARTICLE_READ_COMPLETE: 'article_read_complete',

  // Navigation
  CATEGORY_VIEW: 'category_view',
  SEARCH_PERFORMED: 'search_performed',

  // User interactions
  NEWSLETTER_SUBSCRIBE: 'newsletter_subscribe',
  SOCIAL_SHARE: 'social_share',
  AD_CLICK: 'ad_click',

  // Admin actions
  ADMIN_LOGIN: 'admin_login',
  ARTICLE_PUBLISH: 'article_publish',
  ARTICLE_EDIT: 'article_edit',
} as const;

export type GAEventType = typeof GA_EVENTS[keyof typeof GA_EVENTS];

// Track page views
export function trackPageView(pageTitle?: string, pageLocation?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', import.meta.env.PUBLIC_GA_MEASUREMENT_ID || '', {
      page_title: pageTitle || document.title,
      page_location: pageLocation || window.location.href,
    });
  }
}

// Track custom events
export function trackEvent(
  eventName: GAEventType,
  parameters: Record<string, any> = {}
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...parameters,
      timestamp: new Date().toISOString(),
    });
  }
}

// Track article views
export function trackArticleView(articleId: string, articleTitle: string, category?: string) {
  trackEvent(GA_EVENTS.ARTICLE_VIEW, {
    article_id: articleId,
    article_title: articleTitle,
    category: category,
    content_type: 'article',
  });
}

// Track category views
export function trackCategoryView(categoryName: string, categorySlug: string) {
  trackEvent(GA_EVENTS.CATEGORY_VIEW, {
    category_name: categoryName,
    category_slug: categorySlug,
    content_type: 'category',
  });
}

// Track search
export function trackSearch(searchTerm: string, resultsCount: number) {
  trackEvent(GA_EVENTS.SEARCH_PERFORMED, {
    search_term: searchTerm,
    results_count: resultsCount,
  });
}

// Track social shares
export function trackSocialShare(platform: string, contentType: string, contentId: string) {
  trackEvent(GA_EVENTS.SOCIAL_SHARE, {
    platform: platform,
    content_type: contentType,
    content_id: contentId,
  });
}

// Check if GA is available
export function isGAAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.gtag && !!import.meta.env.PUBLIC_GA_MEASUREMENT_ID;
}
