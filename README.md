# 🎨 Draw by Voice

> Générez des diagrammes d'architecture logicielle par commande vocale grâce à l'IA.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-Realtime%20API-green?logo=openai)](https://platform.openai.com/docs/)

**Draw by Voice** est une application web innovante qui transforme vos descriptions vocales en diagrammes d'architecture professionnels. Parlez naturellement, l'IA comprend votre intention et génère automatiquement des schémas clairs et organisés sur un canvas infini.

![Demo](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Demo+Screenshot)

---

## 📚 Documentation

Pour commencer à utiliser le projet, veuillez consulter les guides suivants :

*   **[⚙️ Guide d'Installation](./docs/INSTALLATION.md)** : Tout ce qu'il faut savoir pour installer et lancer le projet sur votre machine (prérequis, configuration des clés API, etc.).
*   **[📖 Guide d'Utilisation](./docs/UTILISATION.md)** : Apprenez à utiliser les commandes vocales pour générer vos premiers diagrammes.

---

## ✨ Fonctionnalités Clés

*   **🗣️ Contrôle Vocal Naturel** : Discutez avec l'IA comme avec un collègue. Elle comprend le contexte technique.
*   **⚡ Temps Réel** : Les modifications apparaissent instantanément grâce à l'API Realtime d'OpenAI.
*   **🎨 Rendu Professionnel** : Utilise `tldraw` pour le dessin et `dagre` pour l'organisation automatique des nœuds.
*   **🧩 Icônes Intelligentes** : Détecte automatiquement les technologies (React, AWS, Docker, etc.) et applique les icônes correspondantes.

---

## 🏗️ Architecture Technique

Ce projet est construit avec des technologies modernes :

*   **Frontend** : Next.js 16, React 19, Tailwind CSS 4
*   **IA** : OpenAI Realtime API (WebSockets)
*   **Canvas** : Tldraw SDK
*   **Validation** : Zod

---

## 🤝 Contribution

Les contributions sont les bienvenues !
Voir le [Guide de Contribution](./docs/guides/CONTRIBUTING.md) (s'il existe) ou ouvrez simplement une Pull Request.

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

<p align="center">
  Fait avec ❤️ et 🎤
</p>
