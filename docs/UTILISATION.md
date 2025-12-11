# 📖 Guide d'Utilisation

Bienvenue dans **Draw by Voice** ! Cette application vous permet de créer des diagrammes d'architecture logicielle simplement en les décrivant à voix haute.

## 🎤 Interface Principale

L'interface est composée de deux éléments principaux :
1.  **Le Canvas (Zone de dessin)** : C'est ici que vos diagrammes apparaissent. Vous pouvez zoomer, dézoomer et vous déplacer librement.
2.  **La Barre de Contrôle (En bas)** : Contient les boutons pour interagir avec l'IA.

## 🚀 Créer votre premier diagramme

### 1. Activer le mode vocal
Cliquez sur le bouton **Micro** 🎙️ situé en bas à droite de l'écran.
*   **Autorisez l'accès au microphone** si le navigateur vous le demande.
*   Le bouton va clignoter ou changer de couleur pour indiquer la connexion.
*   Une fois connecté (bouton bleu/actif), l'IA vous écoute.

### 2. Décrire votre architecture
Parlez naturellement. Décrivez les composants et leurs interactions.

**Exemple de commande :**
> "Dessine une architecture avec un utilisateur qui se connecte à une application React. L'application appelle une API Node.js, qui lit des données dans une base PostgreSQL."

### 3. Voir le résultat
L'IA va :
*   Vous répondre vocalement pour confirmer la compréhension.
*   Générer les boîtes (nœuds) et les flèches (liens) sur le canvas.
*   Organiser automatiquement le schéma pour qu'il soit lisible.

## 💡 Astuces pour de meilleurs résultats

*   **Soyez précis** : Plus vous donnez de détails ("base de données PostgreSQL" au lieu de juste "base de données"), plus le diagramme sera précis (icônes spécifiques).
*   **Décrivez les flux** : Utilisez des mots comme "appelle", "envoie des données à", "se connecte à" pour créer les liens.
*   **Itérez** : Vous pouvez ajouter des éléments par la suite.
    > "Ajoute un cache Redis entre l'API et la base de données."

## 🛠️ Fonctionnalités du Canvas

*   **Zoom / Déplacement** : Utilisez la molette de la souris pour zoomer, et cliquez-glissez (ou espace + clic) pour vous déplacer.
*   **Sélection** : Cliquez sur un élément pour le sélectionner.
*   **Suppression** : Sélectionnez un élément et appuyez sur `Suppr` ou `Backspace`.

## 🔄 Réinitialiser

Si vous souhaitez recommencer à zéro :
*   Cliquez sur le bouton **Poubelle / Reset** 🗑️.
*   Cela effacera le canvas et réinitialisera la mémoire de l'IA pour une nouvelle conversation.

## 🛑 Résolution de problèmes

*   **L'IA ne répond pas ?** Vérifiez que le bouton micro est bien actif. Si la connexion est perdue, essayez de rafraîchir la page.
*   **Le diagramme est bizarre ?** Vous pouvez déplacer manuellement les éléments si l'auto-layout n'est pas parfait.
