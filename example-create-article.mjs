#!/usr/bin/env node
/**
 * 🚀 Exemple de création d'article via l'API GeeksPatrol
 * Ce script Node.js montre comment créer un article avec toutes les options
 */

const API_URL = 'http://localhost:4321'; // Changez pour votre URL de production
const API_KEY = process.env.API_KEY || 'YOUR_API_KEY_HERE'; // Définir la clé API via variable d'environnement

/**
 * Récupère la liste des catégories disponibles
 */
async function getCategories() {
  console.log('📋 Récupération des catégories...');
  
  try {
    const response = await fetch(`${API_URL}/api/categories/list.json`, {
      headers: {
        'X-API-Key': API_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('\nCatégories disponibles:');
    data.categories.forEach(cat => {
      console.log(`  - [${cat.id}] ${cat.name} (${cat.slug})`);
    });
    
    return data.categories;
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    return [];
  }
}

/**
 * Crée un article complet avec toutes les options
 */
async function createArticle() {
  console.log('\n✍️  Création de l\'article...');
  
  // Données de l'article
  const articleData = {
    title: 'Les tendances tech 2025 : Ce qui va révolutionner notre quotidien',
    content: `
      <h2>Un aperçu des innovations majeures de 2025</h2>
      <p>L'année 2025 s'annonce riche en innovations technologiques. Des avancées en IA 
      à la réalité augmentée, découvrez les tendances qui vont transformer notre quotidien.</p>
      
      <h3>1. L'IA générative partout</h3>
      <p>L'intelligence artificielle générative ne se limite plus à ChatGPT. Elle s'intègre 
      désormais dans :</p>
      <ul>
        <li><strong>Les systèmes d'exploitation</strong> : Windows 12 et macOS 15 intègrent des IA natives</li>
        <li><strong>Les applications mobiles</strong> : Génération de contenu en temps réel</li>
        <li><strong>Les appareils photo</strong> : Amélioration intelligente des photos</li>
        <li><strong>Les assistants vocaux</strong> : Conversations naturelles et contextuelles</li>
      </ul>
      
      <h3>2. La réalité augmentée devient mainstream</h3>
      <p>Avec l'arrivée de l'Apple Vision Pro et ses concurrents, la réalité augmentée 
      sort enfin du stade expérimental :</p>
      <ul>
        <li>Shopping virtuel immersif</li>
        <li>Collaboration à distance en 3D</li>
        <li>Éducation interactive et gamifiée</li>
        <li>Tourisme augmenté</li>
      </ul>
      
      <h3>3. Les voitures autonomes niveau 4</h3>
      <p>2025 marque l'arrivée des premières voitures totalement autonomes (niveau 4) 
      sur les routes européennes. Tesla, Mercedes et Waymo ouvrent la voie.</p>
      
      <blockquote>
        <p>"D'ici 2030, 50% des véhicules vendus en Europe auront des capacités de 
        conduite autonome niveau 3 ou supérieur." - McKinsey & Company</p>
      </blockquote>
      
      <h3>4. L'Internet quantique</h3>
      <p>Les premiers réseaux quantiques commerciaux font leur apparition, promettant :</p>
      <ul>
        <li>Sécurité inviolable des communications</li>
        <li>Vitesses de transmission exponentielles</li>
        <li>Nouvelles applications en finance et santé</li>
      </ul>
      
      <h3>5. La 6G en phase de test</h3>
      <p>Alors que la 5G se déploie encore, la 6G entre en phase de test dans plusieurs pays. 
      Les promesses : vitesses 100x supérieures à la 5G et latence quasi-nulle.</p>
      
      <h3>6. Les batteries solides</h3>
      <p>Les premières batteries à électrolyte solide arrivent sur le marché, offrant :</p>
      <ul>
        <li>Autonomie doublée pour les smartphones et véhicules électriques</li>
        <li>Charge complète en 10 minutes</li>
        <li>Durée de vie de 20 ans</li>
        <li>Sécurité accrue (pas de risque d'incendie)</li>
      </ul>
      
      <h3>Impact sur la société</h3>
      <p>Ces technologies vont transformer profondément notre quotidien :</p>
      <ol>
        <li><strong>Travail</strong> : Télétravail immersif et collaboration virtuelle</li>
        <li><strong>Santé</strong> : Diagnostic précoce par IA et chirurgie assistée</li>
        <li><strong>Éducation</strong> : Apprentissage personnalisé et immersif</li>
        <li><strong>Divertissement</strong> : Expériences gaming révolutionnaires</li>
        <li><strong>Mobilité</strong> : Villes intelligentes et transport autonome</li>
      </ol>
      
      <h3>Conclusion</h3>
      <p>2025 ne sera qu'un début. Ces technologies vont continuer à évoluer et converger 
      pour créer un futur que nous commençons à peine à imaginer.</p>
    `,
    excerpt: 'Découvrez les 6 tendances tech majeures de 2025 : IA générative omniprésente, réalité augmentée mainstream, voitures autonomes niveau 4, Internet quantique et bien plus encore.',
    status: 'approved',
    cover_image_path: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=630',
    cover_image_alt: 'Technologies futuristes et innovation 2025',
    category_ids: [3], // Catégorie "Tech & Gadgets"
    seo_title: 'Tendances Tech 2025 : Les 6 innovations qui vont tout changer',
    seo_description: 'IA générative, réalité augmentée, voitures autonomes, Internet quantique, 6G et batteries solides : découvrez les tendances tech qui vont révolutionner 2025.',
    seo_keywords: 'tendances tech 2025, innovation technologique, IA générative, réalité augmentée, voitures autonomes, Internet quantique, 6G, batteries solides',
    sources: [
      {
        name: 'McKinsey & Company',
        url: 'https://www.mckinsey.com'
      },
      {
        name: 'MIT Technology Review',
        url: 'https://www.technologyreview.com'
      },
      {
        name: 'Gartner',
        url: 'https://www.gartner.com'
      },
      {
        name: 'TechCrunch',
        url: 'https://techcrunch.com'
      }
    ]
  };
  
  try {
    const response = await fetch(`${API_URL}/api/articles/create.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify(articleData)
    });
    
    console.log(`\n📊 Statut HTTP: ${response.status}`);
    
    const data = await response.json();
    
    if (response.status === 201) {
      const { article } = data;
      
      console.log('\n✅ Article créé avec succès!');
      console.log(`   ID: ${article.id}`);
      console.log(`   Titre: ${article.title}`);
      console.log(`   Slug: ${article.slug}`);
      console.log(`   Statut: ${article.status}`);
      console.log(`   Temps de lecture: ${article.reading_time || 'N/A'} min`);
      
      // Afficher les catégories
      if (article.article_categories?.length > 0) {
        console.log('   Catégories:');
        article.article_categories.forEach(ac => {
          if (ac.category) {
            console.log(`     - ${ac.category.name}`);
          }
        });
      }
      
      // Afficher les sources
      if (article.sources?.length > 0) {
        console.log(`   Sources: ${article.sources.length} source(s)`);
      }
      
      // URL de l'article
      const categorySlug = article.article_categories?.[0]?.category?.slug || 'blog';
      const articleUrl = `${API_URL}/${categorySlug}/${article.slug}`;
      console.log(`\n🌐 URL de l'article: ${articleUrl}`);
      
      return article;
    } else {
      console.error('\n❌ Erreur lors de la création de l\'article');
      console.error(`   Message: ${data.error || 'Erreur inconnue'}`);
      if (data.details) {
        console.error(`   Détails: ${data.details}`);
      }
      return null;
    }
  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    return null;
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('='.repeat(60));
  console.log('🚀 Création d\'article via l\'API GeeksPatrol');
  console.log('='.repeat(60));
  
  // Récupérer les catégories
  const categories = await getCategories();
  
  if (categories.length === 0) {
    console.log('\n❌ Impossible de récupérer les catégories. Vérifiez votre API.');
    return;
  }
  
  // Créer l'article
  const article = await createArticle();
  
  if (article) {
    console.log('\n✨ Processus terminé avec succès!');
  } else {
    console.log('\n❌ Échec de la création de l\'article');
  }
  
  console.log('='.repeat(60));
}

// Exécuter
main().catch(error => {
  console.error('Erreur fatale:', error);
  process.exit(1);
});
