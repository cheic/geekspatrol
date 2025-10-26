#!/bin/bash

# 🚀 Exemple de création d'article via l'API GeeksPatrol
# Ce script montre comment créer un article complet avec toutes les options

# Configuration
API_URL="http://localhost:4321"  # Changez pour votre URL de production
API_KEY="6T941FIFyj/zyAzApBD0Qw/hIejqUGxZo2S6GVQXYQ4="  # Votre clé API

echo "📝 Création d'un article via l'API GeeksPatrol"
echo "=============================================="
echo ""

# Étape 1: Récupérer les catégories disponibles
echo "📋 Étape 1: Récupération des catégories..."
CATEGORIES=$(curl -s -X GET "$API_URL/api/categories/list.json" \
  -H "X-API-Key: $API_KEY")

echo "Catégories disponibles:"
echo "$CATEGORIES" | jq -r '.categories[] | "  - [\(.id)] \(.name) (\(.slug))"'
echo ""

# Étape 2: Créer un article complet
echo "✍️  Étape 2: Création de l'article..."

# Générer un timestamp unique pour éviter les doublons de slug
TIMESTAMP=$(date +%s)

RESPONSE=$(curl -s -X POST "$API_URL/api/articles/create.json" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d "{
    \"title\": \"ChatGPT 5 : OpenAI dévoile sa nouvelle IA révolutionnaire ($TIMESTAMP)\",
    \"slug\": \"chatgpt-5-openai-ia-revolutionnaire-$TIMESTAMP\",
    \"slug\": \"chatgpt-5-openai-ia-revolutionnaire-$TIMESTAMP\",
    \"content\": \"<h2>Une avancée majeure dans l'intelligence artificielle</h2><p>OpenAI vient d'annoncer officiellement ChatGPT 5, marquant une nouvelle ère dans le domaine de l'IA conversationnelle. Cette version apporte des améliorations significatives par rapport à son prédécesseur.</p><h3>Les nouvelles fonctionnalités</h3><ul><li>Compréhension contextuelle améliorée de 40%</li><li>Support multimodal natif (texte, image, audio, vidéo)</li><li>Temps de réponse réduit de 60%</li><li>Capacité de raisonnement logique avancée</li><li>Mémoire à long terme sur plusieurs sessions</li></ul><h3>Disponibilité et tarifs</h3><p>ChatGPT 5 sera disponible en version bêta dès le mois prochain pour les utilisateurs ChatGPT Plus. La version gratuite suivra dans les 3 mois.</p><blockquote><p>\\\"Cette version représente un bond en avant significatif dans notre mission de créer une IA bénéfique et sûre pour l'humanité.\\\" - Sam Altman, CEO d'OpenAI</p></blockquote><h3>Impact sur l'industrie</h3><p>Les experts prédisent que ChatGPT 5 va révolutionner plusieurs secteurs :</p><ol><li>Éducation : Tuteurs personnalisés adaptatifs</li><li>Santé : Assistance au diagnostic médical</li><li>Programmation : Génération de code complexe</li><li>Création de contenu : Rédaction assistée par IA</li></ol><p>Cette annonce intervient dans un contexte de compétition intense avec d'autres acteurs comme Google (Gemini), Anthropic (Claude) et Meta (LLaMA).</p>\",
    \"excerpt\": \"OpenAI dévoile ChatGPT 5 avec des capacités multimodales, une compréhension améliorée de 40% et des temps de réponse réduits de 60%. Découvrez les nouvelles fonctionnalités de cette IA révolutionnaire.\",
    \"status\": \"approved\",
    \"cover_image_path\": \"https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630\",
    \"cover_image_alt\": \"Interface ChatGPT 5 sur un écran d'ordinateur\",
    \"category_ids\": [\"f1d2e3c4-b5a6-7890-abcd-ef1234567890\"],
    \"seo_title\": \"ChatGPT 5 : OpenAI lance sa nouvelle IA - Tout savoir\",
    \"seo_description\": \"Découvrez ChatGPT 5, la nouvelle version de l'IA d'OpenAI avec support multimodal, compréhension améliorée et temps de réponse ultra-rapides.\",
    \"seo_keywords\": \"ChatGPT 5, OpenAI, intelligence artificielle, IA conversationnelle, GPT-5, Sam Altman\",
    \"seo_keywords\": \"ChatGPT 5, OpenAI, intelligence artificielle, IA conversationnelle, GPT-5, Sam Altman\",
    \"sources\": [
      {
        \"name\": \"OpenAI Blog\",
        \"url\": \"https://openai.com/blog\"
      },
      {
        \"name\": \"TechCrunch\",
        \"url\": \"https://techcrunch.com\"
      },
      {
        \"name\": \"The Verge\",
        \"url\": \"https://theverge.com\"
      }
    ]
  }")

# Afficher la réponse
echo ""
echo "📊 Réponse de l'API:"
echo "$RESPONSE" | jq '.'

# Vérifier le succès
SUCCESS=$(echo "$RESPONSE" | jq -r '.success')
if [ "$SUCCESS" = "true" ]; then
  ARTICLE_ID=$(echo "$RESPONSE" | jq -r '.article.id')
  ARTICLE_SLUG=$(echo "$RESPONSE" | jq -r '.article.slug')
  ARTICLE_URL="$API_URL/ia/$ARTICLE_SLUG"
  
  echo ""
  echo "✅ Article créé avec succès!"
  echo "   ID: $ARTICLE_ID"
  echo "   Slug: $ARTICLE_SLUG"
  echo "   URL: $ARTICLE_URL"
  echo ""
  echo "🌐 Visitez: $ARTICLE_URL"
else
  echo ""
  echo "❌ Erreur lors de la création de l'article"
  echo "$RESPONSE" | jq -r '.error'
fi

echo ""
echo "✨ Terminé!"
