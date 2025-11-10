import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ArticleFormProps {
  categories: Category[];
}

export function ArticleForm({ categories }: ArticleFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    sourceName: '', // New field for source name
    sourceUrl: '', // Keep for source URL
    coverImageType: 'url' as 'url' | 'upload', // New field to choose between URL or upload
    coverImageUrl: '', // For URL input
    coverImage: null as File | null, // For file upload
    coverImageAlt: ''
  });
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim()) {
      alert('Veuillez remplir tous les champs requis (titre, extrait, contenu)');
      return;
    }

    setIsLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('excerpt', formData.excerpt);
      submitData.append('content', formData.content);
      submitData.append('sourceName', formData.sourceName);
      submitData.append('sourceUrl', formData.sourceUrl);
      submitData.append('coverImageAlt', formData.coverImageAlt);
      submitData.append('categories', JSON.stringify(selectedCategories));
      
      // Handle cover image based on type
      if (formData.coverImageType === 'upload' && formData.coverImage) {
        submitData.append('coverImage', formData.coverImage);
      } else if (formData.coverImageType === 'url') {
        submitData.append('coverImageUrl', formData.coverImageUrl);
      }

      const response = await fetch('/admin/api/articles.json', {
        method: 'POST',
        body: submitData,
        credentials: 'include'
      });

      if (response.ok) {
        alert('Article créé avec succès !');
        // Reset form
        setFormData({
          title: '',
          excerpt: '',
          content: '',
          sourceName: '',
          sourceUrl: '',
          coverImageType: 'url',
          coverImageUrl: '',
          coverImage: null,
          coverImageAlt: ''
        });
        setSelectedCategories([]);
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error}`);
      }
    } catch (error) {
      alert('Erreur lors de la création de l\'article');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, categoryId]);
    } else {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Titre */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Titre *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Titre de l'article"
          />
        </div>

        {/* Extrait */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Extrait *
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
            required
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Résumé court de l'article (requis pour l'approbation)"
          />
        </div>

        {/* Source Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Source (nom)
          </label>
          <input
            type="text"
            value={formData.sourceName}
            onChange={(e) => setFormData({...formData, sourceName: e.target.value})}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
            value={formData.sourceUrl}
            onChange={(e) => setFormData({...formData, sourceUrl: e.target.value})}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="https://www.samsung.com"
          />
        </div>

        {/* Image de couverture */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Image de couverture
          </label>
          
          {/* Type selection */}
          <div className="flex gap-4 mb-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="coverImageType"
                value="url"
                checked={formData.coverImageType === 'url'}
                onChange={(e) => setFormData({...formData, coverImageType: e.target.value as 'url' | 'upload'})}
                className="mr-2"
              />
              URL
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="coverImageType"
                value="upload"
                checked={formData.coverImageType === 'upload'}
                onChange={(e) => setFormData({...formData, coverImageType: e.target.value as 'url' | 'upload'})}
                className="mr-2"
              />
              Upload fichier
            </label>
          </div>

          {/* Conditional input based on type */}
          {formData.coverImageType === 'url' ? (
            <input
              type="url"
              value={formData.coverImageUrl}
              onChange={(e) => setFormData({...formData, coverImageUrl: e.target.value})}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://..."
            />
          ) : (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({...formData, coverImage: e.target.files?.[0] || null})}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Formats acceptés: JPG, PNG, GIF, WebP. Taille max: 5MB
              </p>
            </>
          )}
        </div>

        {/* Texte alternatif */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Texte alternatif de l'image
          </label>
          <input
            type="text"
            value={formData.coverImageAlt}
            onChange={(e) => setFormData({...formData, coverImageAlt: e.target.value})}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Description de l'image pour l'accessibilité"
          />
        </div>

        {/* Catégories */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Catégories
          </label>
          
          {categories.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-sm">Aucune catégorie disponible</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Contenu avec éditeur Markdown */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Contenu *
          </label>
          
          <div data-color-mode="light" className="w-full">
            <MDEditor
              value={formData.content}
              onChange={(value) => setFormData({...formData, content: value || ''})}
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
      <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 font-medium transition-colors"
        >
          {isLoading ? 'Création...' : 'Créer l\'article'}
        </button>
        
        <button
          type="button"
          onClick={() => {
            setFormData({
              title: '',
              excerpt: '',
              content: '',
              sourceName: '',
              sourceUrl: '',
              coverImageType: 'url',
              coverImageUrl: '',
              coverImage: null,
              coverImageAlt: ''
            });
            setSelectedCategories([]);
          }}
          className="px-6 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 font-medium transition-colors"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}