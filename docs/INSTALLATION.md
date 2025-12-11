# ⚙️ Guide d'Installation

Ce guide vous explique comment installer et configurer **Draw by Voice** sur votre machine locale.

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé les outils suivants sur votre machine :

*   **Node.js** (version 20 ou supérieure) : [Télécharger Node.js](https://nodejs.org/)
*   **npm** (installé avec Node.js) ou **pnpm**.
*   **Git** : [Télécharger Git](https://git-scm.com/)
*   Une **Clé API OpenAI** avec accès à l'API Realtime : [Obtenir une clé](https://platform.openai.com/api-keys)

## 🛠️ Installation étape par étape

### 1. Cloner le projet

Ouvrez votre terminal et exécutez la commande suivante pour récupérer le code source :

```bash
git clone https://github.com/votre-username/draw-by-voice.git
cd draw-by-voice
```

### 2. Installer les dépendances

Installez les librairies nécessaires au projet :

```bash
npm install
# ou si vous utilisez pnpm
pnpm install
```

### 3. Configurer l'environnement

Le projet a besoin de votre clé API OpenAI pour fonctionner.

1.  Dupliquez le fichier d'exemple `.env.local.example` :
    ```bash
    cp .env.local.example .env.local
    ```
    *(Sous Windows, vous pouvez simplement copier le fichier et le renommer manuellement)*

2.  Ouvrez le fichier `.env.local` avec votre éditeur de texte préféré.

3.  Remplacez `sk-proj-...` par votre véritable clé API OpenAI :
    ```env
    OPENAI_API_KEY=sk-proj-votre-vraie-cle-api-ici
    ```

⚠️ **Important** : Ne partagez jamais ce fichier et ne le commitez pas sur Git. Il contient vos identifiants secrets.

### 4. Lancer le serveur de développement

Une fois configuré, lancez l'application :

```bash
npm run dev
```

Ouvrez ensuite votre navigateur à l'adresse **[http://localhost:3000](http://localhost:3000)**.

## ✅ Vérification

Pour vérifier que tout fonctionne :
1.  Cliquez sur le bouton **Micro** en bas à droite.
2.  Si le bouton devient bleu après quelques secondes, la connexion avec OpenAI est réussie.
3.  Si une erreur apparaît, vérifiez votre clé API dans le fichier `.env.local`.
