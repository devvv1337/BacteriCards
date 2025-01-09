# BacteriCards

Une application web moderne pour réviser et apprendre les caractéristiques des bactéries à l'aide de flashcards interactives.

## Fonctionnalités

- **Mode HardLearning** : Système de répétition espacée pour un apprentissage optimal
  - Évaluation des cartes (Facile/Moyen/Difficile)
  - Les cartes difficiles reviennent plus fréquemment
  - Mode inversé pour tester les connaissances dans les deux sens
  - Statistiques de progression
  - Sauvegarde automatique de la progression
- Interface sombre moderne et élégante
- Animations fluides pour une meilleure expérience utilisateur
- Design responsive pour mobile et desktop

## Technologies utilisées

- React avec TypeScript
- TailwindCSS pour le styling
- Framer Motion pour les animations
- Vite comme bundler
- LocalStorage pour la persistance des données

## Installation

1. Clonez le repository :
```bash
git clone [URL_DU_REPO]
cd bactericards
```

2. Installez les dépendances :
```bash
npm install
```

3. Lancez l'application en mode développement :
```bash
npm run dev
```

L'application sera disponible à l'adresse `http://localhost:3000`

## Structure des données

Les données des bactéries sont stockées dans un fichier JSON avec les champs suivants :
- Noms
- Localisation
- Symptômes/Maladies
- Spécificités Diagnostic
- Traitement/Prévention

## Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Licence

MIT License - voir le fichier LICENSE pour plus de détails.
