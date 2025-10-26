import React from 'react';
import type { SupabaseArticleRow } from '../types/types';

interface ArticleCardProps {
  article: SupabaseArticleRow;
  variant?: 'featured' | 'regular';
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, variant = 'regular' }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategories = () => {
    if (!article.article_categories) return [];
    return article.article_categories
      .filter((ac): ac is NonNullable<typeof ac> => ac !== null && ac.category !== null && ac.category !== undefined)
      .map(ac => ac.category!)
      .filter((cat): cat is NonNullable<typeof cat> & { id: string; name: string; slug: string } => 
        cat !== null && cat.name !== null && cat.name !== undefined && 
        cat.slug !== null && cat.slug !== undefined &&
        cat.id !== null && cat.id !== undefined
      );
  };

  const categories = getCategories();

  return (
    <article className={`bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${variant === 'featured' ? 'md:col-span-1' : ''}`}>
      {article.cover_image_path && (
        <div className="aspect-video overflow-hidden">
          <img
            src={article.cover_image_path}
            alt={article.cover_image_alt || article.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {formatDate(article.created_at)}
          </span>
          {article.reading_time && (
            <>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {article.reading_time} min de lecture
              </span>
            </>
          )}
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map((category) => (
              <a
                key={category.id}
                href={`/blog/category/${category.slug}`}
                className="inline-block bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded text-xs font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {category.name}
              </a>
            ))}
          </div>
        )}

        <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white line-clamp-2">
          <a href={`/blog/${article.slug}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {article.title}
          </a>
        </h3>

        {article.excerpt && (
          <p className="text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">
            {article.excerpt}
          </p>
        )}

        <a
          href={`/blog/${article.slug}`}
          className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-500 font-medium transition-colors"
        >
          Lire l'article
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </article>
  );
};

export default ArticleCard;