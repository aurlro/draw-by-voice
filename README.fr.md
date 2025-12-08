# 🎨 Draw by Voice

> Générez des diagrammes d'architecture logicielle par commande vocale grâce à l'IA

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-Realtime%20API-green?logo=openai)](https://platform.openai.com/docs/)

**Draw by Voice** est une application web innovante qui transforme vos descriptions vocales en diagrammes d'architecture professionnels. Parlez naturellement, l'IA comprend et génère automatiquement des schémas clairs et organisés.

![Demo](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Demo+Screenshot)

---

## ✨ Fonctionnalités Principales

### 🎤 Contrôle Vocal Intelligent
- **Conversation naturelle** avec l'IA via OpenAI Realtime API.
- **Détection automatique** de fin de phrase (Voice Activity Detection).
- **Audio bidirectionnel** : Entendez l'IA vous répondre.
- **Streaming temps réel** : Interaction fluide et instantanée.

### 🎨 Génération de Diagrammes
- **Auto-layout** : Organisation automatique avec Dagre.
- **Types de nœuds** : User, Server, Database, Decision, Step, et bien plus.
- **Icônes Universelles** : Intégration **Iconify** (200k+ icônes) + Détection de logos.
- **Support Français** : Interaction et génération en français (configurable).
- **Explications textuelles** : Résumé markdown affiché sur le canvas.

### 🛡️ Sécurité & Robustesse
- **Validation Zod** : Schémas stricts pour toutes les données.
- **Clé API côté serveur** : Aucune exposition côté client.
- **Messages d'erreur conviviaux** : Pas de crash, feedback clair.
- **TypeScript strict mode** : Zéro erreur implicite `any`.

### 🎯 Canvas Professionnel
- **tldraw SDK** : Canvas infini, zoom, pan, sélection.
- **Export** : PNG, SVG, JSON.
- **Mode démo** : Exemples pré-configurés (AWS, Login Flow, CI/CD).

---

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 20+
- npm ou pnpm
- Clé API OpenAI ([obtenir une clé](https://platform.openai.com/api-keys))

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/votre-username/draw-by-voice.git
cd draw-by-voice

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.local.example .env.local
# Éditer .env.local et ajouter votre OPENAI_API_KEY

# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Configuration

**`.env.local`** :
```bash
# IMPORTANT : Utiliser OPENAI_API_KEY (pas NEXT_PUBLIC_*)
OPENAI_API_KEY=sk-proj-...
```

> [!WARNING]
> N'utilisez jamais `NEXT_PUBLIC_OPENAI_API_KEY`, car cela exposerait votre clé côté client !

---

## 📖 Guide d'Utilisation

### 1️⃣ Connexion Vocale

1. Cliquez sur le bouton **"Micro"** (coin inférieur droit).
2. Autorisez l'accès au microphone.
3. Attendez la connexion (le bouton devient bleu).
4. Cliquez sur **"Parler"** pour commencer.

### 2️⃣ Générer un Diagramme

**Exemple de commande vocale** :
> "Crée un diagramme avec un utilisateur qui appelle une API, l'API interroge une base de données, puis renvoie les résultats à l'utilisateur."

**L'IA va** :
- ✅ Comprendre votre description.
- ✅ Générer le schéma (nœuds + liens).
- ✅ Afficher sur le canvas avec auto-layout.
- ✅ Ajouter une explication textuelle.
- ✅ Vous répondre vocalement.

### 3️⃣ Optimisation (Coûts & Session)
Utilisez le bouton **"POUBELLE / RESET"** pour :
- Effacer le canvas.
- **Réinitialiser le contexte IA** (Économise des Tokens & $$$).
- Démarrer une nouvelle conversation.

### 4️⃣ Modes de Développement
- **Mock Data** : Test sans API (`lib/mockData.ts`) via les tests E2E.

---

## 🏗️ Architecture Technique

### Stack Technologique

| Couche | Technologies |
|--------|--------------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript 5 |
| **Style** | Tailwind CSS 4 |
| **Canvas** | tldraw SDK 4.2 |
| **IA** | OpenAI Realtime API (WebSocket) |
| **Layout** | Dagre (graph auto-layout) |
| **Validation** | Zod 4.1 |
| **Audio** | Web Audio API (PCM16, 24kHz) |

### Architecture en Couches (Hooks)

```
┌─────────────────────────────────────┐
│      useDiagramAgent.ts             │  ← Couche Logique Métier
│  (Orchestration)                    │
├─────────────────────────────────────┤
│  useRealtimeConnection.ts           │  ← Gestion WebSocket
│  (Couche Connexion)                 │
├─────────────────────────────────────┤
│  useAudioRecorder.ts                │  ← Microphone + PCM16
│  useAudioPlayer.ts                  │  ← Lecture Audio IA
│  (Couche Audio)                     │
└─────────────────────────────────────┘
```

**Pattern** : **Séparation des Préoccupations (SoC)**
- Chaque hook a une **responsabilité unique**.
- **Composabilité** : `useDiagramAgent` orchestre les autres.
- **Testabilité** : Chaque couche peut être testée indépendamment.

---

## 📂 Structure du Projet

```
draw-by-voice/
├── src/                              # 🆕 Tout le code source
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Page principale avec tldraw
│   │   ├── layout.tsx                # Layout global
│   │   ├── globals.css               # Styles globaux
│   │   └── api/
│   │       └── realtime/
│   │           └── session/
│   │               └── route.ts      # API Route (session ephemeral)
│   │
│   ├── features/                     # 🎯 Organisation par domaine
│   │   ├── diagram/                  # Feature : Génération de Diagramme
│   │   │   ├── components/           # TldrawCanvas, AutoLayoutButton, etc.
│   │   │   ├── hooks/                # useDiagramAgent
│   │   │   ├── lib/                  # diagramGenerator, autoLayout, nodeTypeMapping
│   │   │   └── index.ts              # Exports publics
│   │   │
│   │   └── voice/                    # Feature : Contrôle Vocal
│   │       ├── components/           # VoiceControl
│   │       ├── hooks/                # useRealtimeConnection, useAudioRecorder, useAudioPlayer
│   │       ├── lib/                  # functionDefinitions, systemPrompt
│   │       └── index.ts              # Exports publics
│   │
│   ├── shared/                       # Code partagé entre features
│   │   ├── lib/
│   │   │   └── validation/
│   │   │       └── schemas.ts        # 🛡️ Schémas Zod
│   │   ├── types/                    # Types TypeScript centralisés
│   │   │   └── index.ts
│   │   └── index.ts                  # Exports publics
│   │
│   └── config/                       # Configuration centralisée
│       ├── env.ts                    # Validation des variables d'environnement
│       └── site.ts                   # Métadonnées du site
│
├── docs/                             # 📚 Documentation
│   ├── architecture/
│   │   └── ARCHITECTURE.md           # Documentation technique
│   ├── guides/
│   │   ├── LOCAL_SETUP.md
│   │   └── CONTRIBUTING.md
│   ├── specs/
│   │   └── SPECIFICATIONS.md
│   └── media/                        # Ressources média
│
├── public/                           # Assets statiques
├── .env.local.example                # Modèle variables d'env
├── package.json
├── tsconfig.json                     # Config TypeScript
└── README.md                         # 👈 Vous êtes ici (version EN)
```

**Avantages de cette structure** :
- ✅ **Basée sur les Features** : Le code lié à une feature est colocalisé.
- ✅ **Scalabilité** : Facile d'ajouter de nouvelles features.
- ✅ **Limites** : Dépendances claires entre modules.
- ✅ **Testabilité** : Chaque feature peut être testée isolément.

---

## 🔐 Sécurité

### Protection de la Clé API

✅ **Bonne Pratique** :
```typescript
// ✅ Route API (Serveur)
const apiKey = process.env.OPENAI_API_KEY
```

❌ **À éviter** :
```typescript
// ❌ NE JAMAIS FAIRE ÇA !
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
```

### Validation des Données

Toutes les données de l'IA sont validées avec **Zod** :

```typescript
// lib/schemas.ts
export const DiagramDataSchema = z.object({
    nodes: z.array(DiagramNodeSchema).min(1),
    edges: z.array(DiagramEdgeSchema),
    explanation: z.string().min(1),
})

// hooks/useDiagramAgent.ts
const result = DiagramDataSchema.safeParse(data)
if (!result.success) {
    // Message d'erreur convivial
    setError("L'IA a généré des données invalides...")
    return
}
```

---

## 🧪 Développement

### Scripts Disponibles

```bash
npm run dev      # Serveur de développement (http://localhost:3000)
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # Linter ESLint
npx tsc --noEmit # Vérification TypeScript
```

### Tests Manuels

1. **Connexion WebSocket** : Vérifier "✅ Connected to OpenAI" dans la console.
2. **Entrée Audio** : Parler et voir les transcriptions dans les logs.
3. **Sortie Audio** : Entendre l'IA répondre vocalement.
4. **Génération de Diagramme** : Dicter et vérifier le rendu sur le canvas.
5. **Validation** : Tester avec des données invalides (message d'erreur convivial).

---

## 🔧 Configuration Avancée

### Modifier le Modèle IA

**`lib/systemPrompt.ts`** :
```typescript
export const SYSTEM_PROMPT = `
Tu es un expert en architecture logicielle...
`
```

### Ajouter un Type de Nœud

1. **`lib/schemas.ts`** : Ajouter à `NodeTypeSchema`
```typescript
export const NodeTypeSchema = z.enum([
    'user', 'server', 'database', 'decision', 'step',
    'cache' // 👈 Nouveau type
])
```

2. **`lib/nodeTypeMapping.ts`** : Configurer l'apparence
```typescript
cache: {
    color: 'orange',
    geo: 'rectangle',
    iconUrl: 'https://cdn.simpleicons.org/redis'
}
```

---

## 📚 Documentation Supplémentaire

- [Guide d'installation détaillé](./docs/guides/LOCAL_SETUP.md)
- [Spécifications techniques](./docs/specs/SPECIFICATIONS.md)
- [Docs OpenAI Realtime API](https://platform.openai.com/docs/guides/realtime)
- [Docs tldraw SDK](https://tldraw.dev)

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour proposer des améliorations :

1. **Fork** le projet.
2. Créez une **branche de fonctionnalité** (`git checkout -b feature/SuperFeature`).
3. **Commit** vos changements (`git commit -m 'Ajout de SuperFeature'`).
4. **Push** vers la branche (`git push origin feature/SuperFeature`).
5. Ouvrez une **Pull Request**.

### Checklist Avant PR

- [ ] TypeScript compile sans erreur (`npx tsc --noEmit`)
- [ ] Le build réussit (`npm run build`)
- [ ] Le lint passe (`npm run lint`)
- [ ] Code documenté (JSDoc)
- [ ] Tests manuels effectués

---

## 📝 Roadmap

- [ ] Support multilingue (i18n)
- [ ] Export PDF/PowerPoint
- [ ] Collaboration temps réel (multi-utilisateurs)
- [ ] Historique / Annuler / Rétablir
- [ ] Modèles de diagrammes
- [ ] Mode sombre
- [ ] Sauvegarde cloud

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir [LICENSE](./LICENSE) pour plus de détails.

---

## 🙏 Remerciements

- [OpenAI](https://openai.com/) pour l'API Realtime
- [tldraw](https://tldraw.com/) pour l'excellent SDK
- [Dagre](https://github.com/dagrejs/dagre) pour l'algorithme de layout
- [Vercel](https://vercel.com/) pour l'hébergement Next.js

---

## 📧 Contact

- **Auteur** : Aurélien Rodier
- **GitHub** : [@aurelienrodier](https://github.com/aurelienrodier)

---

<p align="center">
  Fait avec ❤️ et 🎤
</p>
