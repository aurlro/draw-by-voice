# 🚀 Lancement Local - Draw by Voice

Ce guide vous explique comment installer, lancer en développement, et simuler un environnement de production sur votre machine locale.

## Prérequis

- **Node.js** (version 20 ou supérieure recommandée)
- **npm** (installé avec Node.js)
- Une clé API **OpenAI** (avec accès à l'API Realtime)

## 📥 1. Installation

1.  **Cloner le projet** :
    ```bash
    git clone https://github.com/your-username/draw-by-voice.git
    cd draw-by-voice
    ```

2.  **Installer les dépendances** :
    ```bash
    npm install
    ```

## ⚙️ 2. Configuration

1.  **Créer le fichier d'environnement** :
    Dupliquez le fichier `.env.local.example` et renommez-le en `.env.local` :
    ```bash
    cp .env.local.example .env.local
    ```

2.  **Ajouter votre clé API OpenAI** :
    Ouvrez le fichier `.env.local` avec votre éditeur de texte préféré et ajoutez votre clé :
    ```env
    OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx
    ```
    > **⚠️ Important** : Assurez-vous que votre clé a accès au modèle `gpt-4o-realtime-preview` ou équivalent.

## 🛠️ 3. Développement (Mode Dev)

Pour lancer l'application en mode développement (avec rechargement à chaud) :

```bash
npm run dev
```

- L'application sera accessible sur : [http://localhost:3000](http://localhost:3000)

## 🚀 4. Production (Simulation Locale)

Pour simuler un environnement de production localement (optimisé, sans logs de debug, similaire au déploiement Vercel) :

1.  **Construire l'application (Build)** :
    Cette étape compile le code TypeScript et optimise les assets.
    ```bash
    npm run build
    ```
    *Si vous rencontrez des erreurs lors du build, vérifiez que `npm run lint` ne renvoie pas d'erreurs bloquantes.*

2.  **Lancer le serveur de production** :
    ```bash
    npm run start
    ```

- L'application sera accessible sur : [http://localhost:3000](http://localhost:3000)
- En ce mode, les performances sont maximales et les logs de développement sont désactivés.

## 🧪 5. Vérification et Tests

Pour vous assurer que tout fonctionne correctement avant de déployer :

- **Linter** (Analyse statique du code) :
    ```bash
    npm run lint
    ```

- **Tests E2E** (Playwright) :
    Nécessite l'installation des navigateurs de test une première fois :
    ```bash
    npx playwright install
    ```
    Puis lancez les tests :
    ```bash
    npx playwright test
    ```

## ❓ Dépannage

- **Erreur "Module not found"** : Relancez `npm install`.
- **Erreur de build TypeScript** : Vérifiez les logs, corrigez les erreurs de type.
- **Erreur WebSocket / OpenAI** : Vérifiez que votre `OPENAI_API_KEY` est valide et a les crédits nécessaires.
