#!/usr/bin/env python3
"""
🚀 Exemple de création d'article via l'API GeeksPatrol
Ce script Python montre comment créer un article avec toutes les options
"""

import requests
import json
from datetime import datetime

# Configuration
API_URL = "http://localhost:4321"  # Changez pour votre URL de production
API_KEY = "6T941FIFyj/zyAzApBD0Qw/hIejqUGxZo2S6GVQXYQ4="  # Votre clé API

def get_categories():
    """Récupère la liste des catégories disponibles"""
    print("📋 Récupération des catégories...")
    
    response = requests.get(
        f"{API_URL}/api/categories/list.json",
        headers={"X-API-Key": API_KEY}
    )
    
    if response.status_code == 200:
        data = response.json()
        print("\nCatégories disponibles:")
        for cat in data['categories']:
            print(f"  - [{cat['id']}] {cat['name']} ({cat['slug']})")
        return data['categories']
    else:
        print(f"❌ Erreur: {response.status_code}")
        return []

def create_article():
    """Crée un article complet avec toutes les options"""
    print("\n✍️  Création de l'article...")
    
    # Données de l'article
    article_data = {
        "title": "Les smartphones pliables de 2025 : Notre comparatif complet",
        "content": """
            <h2>Une nouvelle génération de smartphones pliables</h2>
            <p>2025 marque un tournant pour les smartphones pliables. Les fabricants ont enfin résolu 
            les problèmes de durabilité qui ont longtemps entravé l'adoption de cette technologie.</p>
            
            <h3>Le top 5 des smartphones pliables</h3>
            <ol>
                <li><strong>Samsung Galaxy Z Fold 6</strong> - Le pionnier s'améliore encore</li>
                <li><strong>Google Pixel Fold 2</strong> - L'expérience Android pure</li>
                <li><strong>OnePlus Open 2</strong> - Le meilleur rapport qualité-prix</li>
                <li><strong>Xiaomi Mix Fold 4</strong> - L'innovation chinoise</li>
                <li><strong>Honor Magic V3</strong> - Le plus fin du marché</li>
            </ol>
            
            <h3>Samsung Galaxy Z Fold 6 : Notre choix n°1</h3>
            <p>Samsung continue de dominer le marché avec le Z Fold 6. Cette 6ème génération apporte :</p>
            <ul>
                <li>Écran interne de 7.6 pouces avec 120Hz adaptatif</li>
                <li>Puce Snapdragon 8 Gen 3 optimisée</li>
                <li>Batterie de 4800mAh avec charge 45W</li>
                <li>Certification IPX8 (résistance à l'eau)</li>
                <li>S Pen intégré dans la charnière</li>
            </ul>
            
            <h3>Google Pixel Fold 2 : L'intelligence artificielle au service du pliable</h3>
            <p>Google mise tout sur l'IA avec Gemini intégré directement dans le système. 
            Les fonctionnalités phares incluent :</p>
            <ul>
                <li>Traduction instantanée en mode "livre"</li>
                <li>Retouche photo avancée avec Magic Editor</li>
                <li>Assistant vocal contextuellement aware</li>
                <li>Caméra Tensor G4 avec zoom optique 5x</li>
            </ul>
            
            <blockquote>
                <p>"Les smartphones pliables ne sont plus un gadget. Ils représentent désormais 
                25% des ventes de smartphones premium." - IDC Research, Janvier 2025</p>
            </blockquote>
            
            <h3>Prix et disponibilité</h3>
            <table>
                <thead>
                    <tr>
                        <th>Modèle</th>
                        <th>Prix</th>
                        <th>Disponibilité</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Samsung Galaxy Z Fold 6</td>
                        <td>1899€</td>
                        <td>Disponible</td>
                    </tr>
                    <tr>
                        <td>Google Pixel Fold 2</td>
                        <td>1799€</td>
                        <td>Pré-commande</td>
                    </tr>
                    <tr>
                        <td>OnePlus Open 2</td>
                        <td>1499€</td>
                        <td>Disponible</td>
                    </tr>
                </tbody>
            </table>
            
            <h3>Notre verdict</h3>
            <p>Si vous cherchez le meilleur smartphone pliable, le Samsung Galaxy Z Fold 6 reste 
            notre recommandation principale pour sa maturité et son écosystème. Le Pixel Fold 2 
            est parfait pour les fans de Google et d'IA, tandis que le OnePlus Open 2 offre le 
            meilleur rapport qualité-prix.</p>
        """,
        "excerpt": "Découvrez notre comparatif complet des meilleurs smartphones pliables de 2025. Samsung, Google, OnePlus : quel modèle choisir ? Prix, caractéristiques et notre verdict.",
        "status": "approved",  # Article publié directement
        "cover_image_path": "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&h=630",
        "cover_image_alt": "Smartphone pliable Samsung Galaxy Z Fold ouvert",
        "category_ids": [2],  # Catégorie "Mobile"
        "seo_title": "Smartphones Pliables 2025 : Comparatif & Guide d'achat",
        "seo_description": "Comparatif des meilleurs smartphones pliables 2025 : Samsung Z Fold 6, Pixel Fold 2, OnePlus Open 2. Tests, prix, caractéristiques et notre verdict.",
        "seo_keywords": "smartphone pliable, Galaxy Z Fold 6, Pixel Fold 2, OnePlus Open 2, comparatif 2025, téléphone pliant",
        "sources": [
            {
                "name": "Samsung France",
                "url": "https://www.samsung.com/fr/"
            },
            {
                "name": "Google Store",
                "url": "https://store.google.com/"
            },
            {
                "name": "GSMArena",
                "url": "https://www.gsmarena.com"
            },
            {
                "name": "IDC Research",
                "url": "https://www.idc.com"
            }
        ]
    }
    
    # Envoi de la requête
    response = requests.post(
        f"{API_URL}/api/articles/create.json",
        headers={
            "Content-Type": "application/json",
            "X-API-Key": API_KEY
        },
        json=article_data
    )
    
    # Traitement de la réponse
    print(f"\n📊 Statut HTTP: {response.status_code}")
    
    if response.status_code == 201:
        data = response.json()
        article = data['article']
        
        print("\n✅ Article créé avec succès!")
        print(f"   ID: {article['id']}")
        print(f"   Titre: {article['title']}")
        print(f"   Slug: {article['slug']}")
        print(f"   Statut: {article['status']}")
        print(f"   Temps de lecture: {article.get('reading_time', 'N/A')} min")
        
        # Afficher les catégories
        if article.get('article_categories'):
            print(f"   Catégories:")
            for ac in article['article_categories']:
                if ac.get('category'):
                    print(f"     - {ac['category']['name']}")
        
        # Afficher les sources
        if article.get('sources'):
            print(f"   Sources: {len(article['sources'])} source(s)")
        
        # URL de l'article
        category_slug = article['article_categories'][0]['category']['slug'] if article.get('article_categories') else 'blog'
        article_url = f"{API_URL}/{category_slug}/{article['slug']}"
        print(f"\n🌐 URL de l'article: {article_url}")
        
        return article
    else:
        print("\n❌ Erreur lors de la création de l'article")
        try:
            error_data = response.json()
            print(f"   Message: {error_data.get('error', 'Erreur inconnue')}")
            if 'details' in error_data:
                print(f"   Détails: {error_data['details']}")
        except:
            print(f"   Réponse brute: {response.text}")
        return None

def main():
    """Fonction principale"""
    print("=" * 60)
    print("🚀 Création d'article via l'API GeeksPatrol")
    print("=" * 60)
    
    # Récupérer les catégories
    categories = get_categories()
    
    if not categories:
        print("\n❌ Impossible de récupérer les catégories. Vérifiez votre API.")
        return
    
    # Créer l'article
    article = create_article()
    
    if article:
        print("\n✨ Processus terminé avec succès!")
    else:
        print("\n❌ Échec de la création de l'article")
    
    print("=" * 60)

if __name__ == "__main__":
    main()
