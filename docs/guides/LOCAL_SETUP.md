# 🚀 Lancement Local - Draw by Voice

Ce guide vous explique comment installer et lancer le projet **Draw by Voice** sur votre machine locale.

## Prérequis

- **Node.js** (version 18 ou supérieure recommandée)
- **npm** (installé avec Node.js)
- Une clé API **OpenAI** (avec accès à l'API Realtime)

## Installation

1.  **Cloner le projet** (si ce n'est pas déjà fait) :
    ```bash
    git clone <votre-repo-url>
    cd draw-by-voice
    ```

2.  **Installer les dépendances** :
    ```bash
    npm install
    ```

## Configuration

1.  **Créer le fichier d'environnement** :
    Dupliquez le fichier `.env.local.example` et renommez-le en `.env.local` :
    ```bash
    cp .env.local.example .env.local
    ```

2.  **Ajouter votre clé API OpenAI** :
    Ouvrez le fichier `.env.local` et ajoutez votre clé :
    ```env
    OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx
    ```
    *Note : Assurez-vous que votre clé a accès aux modèles Realtime.*

## Lancement

1.  **Démarrer le serveur de développement** :
    ```bash
    npm run dev
    ```

2.  **Accéder à l'application** :
    Ouvrez votre navigateur et allez sur :
    [http://localhost:3000](http://localhost:3000)

## Utilisation

1.  **Autoriser le micro** : Lors de la première utilisation, le navigateur vous demandera l'autorisation d'utiliser le microphone. Acceptez pour utiliser les commandes vocales.
2.  **Mode Démo** : Cliquez sur le bouton "Demo" pour générer des diagrammes d'exemple sans utiliser l'API.
3.  **Mode Vocal** : Cliquez sur le bouton "Micro", parlez pour décrire votre architecture (ex: "Dessine une architecture AWS avec un load balancer et deux serveurs"), et voyez le diagramme se générer en temps réel !

## Dépannage

- **Erreur de connexion** : Vérifiez votre clé API dans `.env.local`.
- **Microphone inactif** : Vérifiez les permissions de votre navigateur (souvent une icône de caméra/micro dans la barre d'adresse).
