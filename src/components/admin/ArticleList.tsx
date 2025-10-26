import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  status: 'draft' | 'pending' | 'approved' | 'archived';
  created_at: string;
  updated_at: string;
  cover_image_path: string | null;
  cover_image_alt: string | null;
  categories?: any[];
  article_categories?: any[];
  sources?: any[];
  // Propriétés pour l'édition (mêmes que ArticleForm)
  sourceName?: string;
  sourceUrl?: string;
  coverImageType?: 'url' | 'upload';
  coverImageUrl?: string;
  coverImage?: File | null;
  coverImageAlt?: string;
}

interface ArticleListProps {
  articles: Article[];
  categories: Category[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function ArticleList({ articles, categories }: ArticleListProps) {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<{
    show: boolean;
    action: string;
    articleId: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Grouper les articles par statut
  const pendingArticles = articles.filter(a => a.status === 'pending' || a.status === 'draft');
  const approvedArticles = articles.filter(a => a.status === 'approved');
  const archivedArticles = articles.filter(a => a.status === 'archived');

  const handleArticleAction = async (action: string, articleId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/admin/api/articles/${articleId}.json`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
        credentials: 'include'
      });

      if (response.ok) {
        // Recharger la page pour voir les changements
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'action');
    } finally {
      setIsLoading(false);
      setShowConfirmDialog(null);
    }
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    }
  };

  const handleEditArticle = (article: Article) => {
    console.log('🟢 handleEditArticle called for article:', article.title, 'ID:', article.id);
    const articleForEdit = {
      ...article,
      // Garantir que tous les champs ont une valeur par défaut (jamais null ou undefined)
      title: article.title || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
      coverImageType: 'url' as 'url' | 'upload',
      coverImageUrl: article.cover_image_path || '',
      coverImage: null,
      coverImageAlt: article.cover_image_alt || '',
      sourceName: '',
      sourceUrl: '',
    };

    // Si il y a des sources, prendre la première pour les champs simples
    if (article.sources && article.sources.length > 0) {
      articleForEdit.sourceName = article.sources[0].name || '';
      articleForEdit.sourceUrl = article.sources[0].url || '';
    }

    console.log('Article for edit:', articleForEdit);
    setSelectedArticle(articleForEdit);
    // Pré-remplir les catégories sélectionnées
    // La structure est: article.article_categories = [{category_id: "...", category: {id: "...", name: "..."}}]
    const currentCategoryIds = article.article_categories
      ?.filter((ac: any) => ac?.category_id || ac?.category?.id)
      ?.map((ac: any) => ac.category_id || ac.category?.id) || [];
    console.log('🔵 Article categories from DB:', article.article_categories);
    console.log('🔵 Extracted category IDs:', currentCategoryIds);
    setSelectedCategories(currentCategoryIds);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedArticle) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', selectedArticle.title);
      formData.append('slug', selectedArticle.slug); // Le slug est requis
      formData.append('description', selectedArticle.excerpt || ''); // L'API attend 'description' au lieu de 'excerpt'
      formData.append('content', selectedArticle.content || '');
      formData.append('categoryIds', JSON.stringify(selectedCategories));
      
      // Sources - formater comme un tableau JSON
      const sources = [];
      if (selectedArticle.sourceName || selectedArticle.sourceUrl) {
        sources.push({
          name: selectedArticle.sourceName || '',
          url: selectedArticle.sourceUrl || '',
          type: 'article'
        });
      }
      formData.append('sources', JSON.stringify(sources));

      // Image de couverture
      if (selectedArticle.coverImageType === 'url' && selectedArticle.coverImageUrl) {
        formData.append('imageType', 'url');
        formData.append('imageUrl', selectedArticle.coverImageUrl);
      } else if (selectedArticle.coverImageType === 'upload' && selectedArticle.coverImage) {
        formData.append('imageType', 'file');
        formData.append('imageFile', selectedArticle.coverImage);
      }

      const response = await fetch(`/admin/api/articles/${selectedArticle.id}.json`, {
        method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la modification de l\'article');
      }

      // Recharger les articles
      window.location.reload(); // Recharger la page pour voir les changements
      setSelectedArticle(null);
      setSelectedCategories([]);
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      alert(error instanceof Error ? error.message : 'Erreur lors de la modification de l\'article');
      alert('Erreur lors de la modification de l\'article');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveArticle = async () => {
    if (!selectedArticle) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/admin/api/articles/${selectedArticle.id}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: selectedArticle.title,
          excerpt: selectedArticle.excerpt,
          content: selectedArticle.content,
          cover_image_path: selectedArticle.cover_image_path,
          cover_image_alt: selectedArticle.cover_image_alt
        }),
        credentials: 'include'
      });

      if (response.ok) {
        alert('Article sauvegardé avec succès');
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Articles en attente */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
          Articles en attente ({pendingArticles.length})
        </h2>
        
        {pendingArticles.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">Aucun article en attente</p>
        ) : (
          <div className="space-y-4">
            {pendingArticles.map((article) => (
              <article 
                key={article.id}
                className={`border border-slate-200 dark:border-slate-700 rounded-lg p-4 ${
                  selectedArticle?.id === article.id ? 'ring-2 ring-indigo-500' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      {article.title}
                    </h3>
                    
                    {article.article_categories && article.article_categories.length > 0 && (
                      <div className="flex gap-2 mb-2">
                        {article.article_categories.map((ac, idx) => (
                          ac?.category && (
                            <span 
                              key={idx}
                              className="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded text-xs"
                            >
                              {ac.category.name}
                            </span>
                          )
                        ))}
                      </div>
                    )}
                    
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Créé le {new Date(article.created_at).toLocaleDateString('fr-FR')}
                    </p>
                    
                    {article.excerpt && (
                      <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditArticle(article)}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      Éditer
                    </button>
                    
                    <button
                      onClick={() => setShowConfirmDialog({ show: true, action: 'approve', articleId: article.id })}
                      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      Approuver
                    </button>
                    
                    <button
                      onClick={() => setShowConfirmDialog({ show: true, action: 'reject', articleId: article.id })}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Rejeter
                    </button>
                    
                    <button
                      onClick={() => setShowConfirmDialog({ show: true, action: 'delete', articleId: article.id })}
                      className="px-3 py-1 bg-red-800 text-white rounded text-sm hover:bg-red-900 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>

                {/* Formulaire d'édition inline */}
                {selectedArticle?.id === article.id && (
                  <div className="border-t border-slate-200 dark:border-slate-700 mt-4 pt-4">
                    <form onSubmit={handleEditSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Titre */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Titre *
                          </label>
                          <input
                            type="text"
                            value={selectedArticle?.title || ''}
                            onChange={(e) => setSelectedArticle(selectedArticle ? {...selectedArticle, title: e.target.value} : null)}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>

                        {/* Extrait */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Extrait *
                          </label>
                          <textarea
                            value={selectedArticle?.excerpt || ''}
                            onChange={(e) => setSelectedArticle(selectedArticle ? {...selectedArticle, excerpt: e.target.value} : null)}
                            rows={3}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                          />
                        </div>

                        {/* Source Name */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Source (nom)
                          </label>
                          <input
                            type="text"
                            value={selectedArticle?.sourceName || ''}
                            onChange={(e) => setSelectedArticle(selectedArticle ? {...selectedArticle, sourceName: e.target.value} : null)}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Samsung"
                          />
                        </div>

                        {/* Source URL */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Source (URL)
                          </label>
                          <input
                            type="url"
                            value={selectedArticle?.sourceUrl || ''}
                            onChange={(e) => setSelectedArticle(selectedArticle ? {...selectedArticle, sourceUrl: e.target.value} : null)}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="https://www.samsung.com"
                          />
                        </div>

                        {/* Image de couverture */}
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Image de couverture
                          </label>
                          <div className="space-y-3">
                            <div className="flex gap-4">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="coverImageType"
                                  value="url"
                                  checked={selectedArticle?.coverImageType === 'url'}
                                  onChange={(e) => setSelectedArticle(selectedArticle ? {...selectedArticle, coverImageType: e.target.value as 'url' | 'upload'} : null)}
                                  className="mr-2"
                                />
                                URL
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name="coverImageType"
                                  value="upload"
                                  checked={selectedArticle?.coverImageType === 'upload'}
                                  onChange={(e) => setSelectedArticle(selectedArticle ? {...selectedArticle, coverImageType: e.target.value as 'url' | 'upload'} : null)}
                                  className="mr-2"
                                />
                                Upload fichier
                              </label>
                            </div>

                            {selectedArticle?.coverImageType === 'url' ? (
                              <input
                                type="url"
                                value={selectedArticle?.coverImageUrl || ''}
                                onChange={(e) => setSelectedArticle(selectedArticle ? {...selectedArticle, coverImageUrl: e.target.value} : null)}
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            ) : (
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setSelectedArticle(selectedArticle ? {...selectedArticle, coverImage: e.target.files?.[0] || null} : null)}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                              />
                            )}
                          </div>
                        </div>

                        {/* Texte alternatif */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Texte alternatif de l'image
                          </label>
                          <input
                            type="text"
                            value={selectedArticle?.coverImageAlt || ''}
                            onChange={(e) => setSelectedArticle(selectedArticle ? {...selectedArticle, coverImageAlt: e.target.value} : null)}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Description de l'image pour l'accessibilité"
                          />
                        </div>

                        {/* Catégories */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Catégories
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {categories.map((category) => {
                              const isChecked = selectedCategories.includes(category.id);
                              console.log(`Category ${category.name} (${category.id}): checked=${isChecked}`, selectedCategories);
                              return (
                                <label key={category.id} className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                                    className="mr-2"
                                  />
                                  {category.name}
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        {/* Contenu avec éditeur Markdown */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Contenu *
                          </label>

                          <div data-color-mode="light" className="w-full">
                            <MDEditor
                              value={selectedArticle?.content || ''}
                              onChange={(value) => setSelectedArticle(selectedArticle ? {...selectedArticle, content: value || null} : null)}
                              preview="edit"
                              hideToolbar={false}
                              visibleDragbar={false}
                              className="w-full"
                              textareaProps={{
                                placeholder: 'Contenu de l\'article en Markdown...'
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Boutons */}
                      <div className="flex gap-3 justify-end pt-6 border-t border-slate-200 dark:border-slate-700 mt-6">
                        <button
                          type="button"
                          onClick={() => setSelectedArticle(null)}
                          className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors"
                        >
                          Annuler
                        </button>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {isLoading ? 'Modification...' : 'Modifier l\'article'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Articles approuvés */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
          Articles publiés ({approvedArticles.length})
        </h2>
        
        {approvedArticles.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">Aucun article publié</p>
        ) : (
          <div className="space-y-4">
            {approvedArticles.slice(0, 10).map((article) => (
              <article key={article.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      <a href={`/blog/${article.slug}`} target="_blank" className="hover:text-indigo-600 dark:hover:text-indigo-400">
                        {article.title}
                      </a>
                    </h3>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Publié le {new Date(article.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleEditArticle(article)}
                    className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors mr-2"
                  >
                    Modifier
                  </button>
                  
                  <button
                    onClick={() => setShowConfirmDialog({ show: true, action: 'unpublish', articleId: article.id })}
                    className="px-3 py-1 bg-orange-600 text-white rounded text-sm hover:bg-orange-700 transition-colors mr-2"
                  >
                    Dépublier
                  </button>
                  
                  <button
                    onClick={() => setShowConfirmDialog({ show: true, action: 'delete', articleId: article.id })}
                    className="px-3 py-1 bg-red-800 text-white rounded text-sm hover:bg-red-900 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Articles archivés */}
      <div>
        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
          Articles archivés ({archivedArticles.length})
        </h2>
        
        {archivedArticles.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">Aucun article archivé</p>
        ) : (
          <div className="space-y-4">
            {archivedArticles.map((article) => (
              <article key={article.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                      Rejeté le {new Date(article.updated_at).toLocaleDateString('fr-FR')}
                    </p>
                    
                    {article.excerpt && (
                      <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditArticle(article)}
                      className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      Éditer
                    </button>
                    
                    <button
                      onClick={() => setShowConfirmDialog({ show: true, action: 'unpublish', articleId: article.id })}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      Remettre en attente
                    </button>
                    
                    <button
                      onClick={() => setShowConfirmDialog({ show: true, action: 'delete', articleId: article.id })}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

    {/* Dialogue de confirmation */}
    {showConfirmDialog?.show && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4">
          <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">
            Confirmation
          </h3>

          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {showConfirmDialog.action === 'approve' && 'Êtes-vous sûr de vouloir approuver cet article ?'}
            {showConfirmDialog.action === 'reject' && 'Êtes-vous sûr de vouloir rejeter cet article ?'}
            {showConfirmDialog.action === 'unpublish' && 'Êtes-vous sûr de vouloir remettre cet article en attente ?'}
            {showConfirmDialog.action === 'delete' && 'Êtes-vous sûr de vouloir supprimer définitivement cet article ? Cette action est irréversible.'}
          </p>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowConfirmDialog(null)}
              className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700 transition-colors"
            >
              Annuler
            </button>

            <button
              onClick={() => handleArticleAction(showConfirmDialog.action, showConfirmDialog.articleId)}
              disabled={isLoading}
              className={`px-4 py-2 text-white rounded transition-colors ${
                showConfirmDialog.action === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                showConfirmDialog.action === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                showConfirmDialog.action === 'unpublish' ? 'bg-blue-600 hover:bg-blue-700' :
                'bg-red-600 hover:bg-red-700'
              } disabled:opacity-50`}
            >
              {isLoading ? 'Traitement...' :
               showConfirmDialog.action === 'approve' ? 'Approuver' :
               showConfirmDialog.action === 'reject' ? 'Rejeter' :
               showConfirmDialog.action === 'unpublish' ? 'Remettre en attente' :
               'Supprimer'}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
}