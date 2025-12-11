# 🎨 Draw by Voice

<<<<<<< HEAD
> Generate software architecture diagrams by voice command using AI
=======
> Générez des diagrammes d'architecture logicielle par commande vocale grâce à l'IA
>>>>>>> origin/enhance-diagram-visuals-bindings

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-Realtime%20API-green?logo=openai)](https://platform.openai.com/docs/)

<<<<<<< HEAD
**Draw by Voice** is an innovative web application that transforms your voice descriptions into professional architecture diagrams. Speak naturally, and the AI understands and automatically generates clear and organized schemas.
=======
**Draw by Voice** est une application web innovante qui transforme vos descriptions vocales en diagrammes d'architecture professionnels. Parlez naturellement, l'IA comprend et génère automatiquement des schémas clairs et organisés.
>>>>>>> origin/enhance-diagram-visuals-bindings

![Demo](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Demo+Screenshot)

---

<<<<<<< HEAD
## ✨ Key Features

### 🎤 Intelligent Voice Control
- **Natural Conversation** with AI via OpenAI Realtime API.
- **Automatic Voice Activity Detection (VAD)**.
- **Bidirectional Audio**: Hear the AI respond to you.
- **Real-time Streaming**: Fluid and instant interaction.

### 🎨 Diagram Generation
- **Auto-layout**: Automatic organization using Dagre.
- **Node Types**: User, Server, Database, Decision, Step, and more.
- **Universal Icons**: Integration with **Iconify** (200k+ icons) + Logo Detection.
- **Language Support**: French interaction and generation (configurable).
- **Textual Explanations**: Markdown summary displayed on the canvas.

### 🛡️ Security & Robustness
- **Zod Validation**: Strict schemas for all data.
- **Server-Side API Key**: No exposure on the client side.
- **User-Friendly Error Messages**: No crashes, clear feedback.
- **TypeScript Strict Mode**: Zero implicit `any` errors.

### 🎯 Professional Canvas
- **tldraw SDK**: Infinite canvas, zoom, pan, selection.
- **Export**: PNG, SVG, JSON.
- **Demo Mode**: Pre-configured examples (AWS, Login Flow, CI/CD).

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or pnpm
- OpenAI API Key ([get a key](https://platform.openai.com/api-keys))
=======
## ✨ Fonctionnalités Principales

### 🎤 Contrôle Vocal Intelligent
- **Conversation naturelle** avec l'IA via OpenAI Realtime API
- **Détection automatique** de fin de phrase (Voice Activity Detection)
- **Audio bidirectionnel** : Entendez l'IA vous répondre
- **Streaming temps réel** : Interaction fluide et instantanée

### 🎨 Génération de Diagrammes
- **Auto-layout** : Organisation automatique avec Dagre
- **Types de nœuds** : User, Server, Database, Decision, Step
- **Icônes Universelles** : Intégration **Iconify** (200k+ icônes) + Logo Detection
- **Support Français** : Interaction et génération 100% en français
- **Explications textuelles** : Résumé markdown affiché sur le canvas

### 🛡️ Sécurité & Robustesse
- **Validation Zod** : Schémas stricts pour toutes les données
- **Clé API serveur-only** : Aucune exposition côté client
- **Messages d'erreur conviviaux** : Pas de crash, feedback clair
- **TypeScript strict mode** : Zéro erreur implicite `any`

### 🎯 Canvas Professionnel
- **tldraw SDK** : Canvas infini, zoom, pan, sélection
- **Export** : PNG, SVG, JSON
- **Mode démo** : Exemples pré-configurés (AWS, Login Flow, CI/CD)

---

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 20+
- npm ou pnpm
- Clé API OpenAI ([obtenir une clé](https://platform.openai.com/api-keys))
>>>>>>> origin/enhance-diagram-visuals-bindings

### Installation

```bash
<<<<<<< HEAD
# Clone the repository
git clone https://github.com/your-username/draw-by-voice.git
cd draw-by-voice

# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local
# Edit .env.local and add your OPENAI_API_KEY

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Configuration

**`.env.local`**:
```bash
# IMPORTANT: Use OPENAI_API_KEY (not NEXT_PUBLIC_*)
=======
# Cloner le dépôt
git clone https://github.com/your-username/draw-by-voice.git
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
# IMPORTANT: Utiliser OPENAI_API_KEY (pas NEXT_PUBLIC_*)
>>>>>>> origin/enhance-diagram-visuals-bindings
OPENAI_API_KEY=sk-proj-...
```

> [!WARNING]
<<<<<<< HEAD
> Never use `NEXT_PUBLIC_OPENAI_API_KEY` as it would expose your key to the client side!

---

## 📖 Usage Guide

### 1️⃣ Voice Connection

1. Click the **"Mic"** button (bottom right corner).
2. Allow microphone access.
3. Wait for connection (button turns blue).
4. Click **"Speak"** to start.

### 2️⃣ Generate a Diagram

**Example Voice Command**:
> "Create a diagram with a user calling an API, the API queries a database, and then returns the results to the user."

**The AI will**:
- ✅ Understand your description.
- ✅ Generate the schema (nodes + edges).
- ✅ Display on the canvas with auto-layout.
- ✅ Add a textual explanation.
- ✅ Respond vocally.

### 3️⃣ Optimization (Costs & Session)
Use the **"TRASH / RESET"** button to:
- Clear the canvas.
- **Reset AI context** (Saves Tokens & $$$).
- Start a fresh conversation.

### 4️⃣ Development Modes
- **Mock Data**: Test without API (`lib/mockData.ts`) via E2E tests.

---

## 🏗️ Technical Architecture

### Technology Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Canvas** | tldraw SDK 4.2 |
| **AI** | OpenAI Realtime API (WebSocket) |
| **Layout** | Dagre (graph auto-layout) |
| **Validation** | Zod 4.1 |
| **Audio** | Web Audio API (PCM16, 24kHz) |

### Layered Architecture (Hooks)

```
┌─────────────────────────────────────┐
│      useDiagramAgent.ts             │  ← Business Logic Layer
│  (Orchestration)                    │
├─────────────────────────────────────┤
│  useRealtimeConnection.ts           │  ← WebSocket Management
│  (Connection Layer)                 │
├─────────────────────────────────────┤
│  useAudioRecorder.ts                │  ← Microphone + PCM16
│  useAudioPlayer.ts                  │  ← AI Audio Playback
=======
> Ne jamais utiliser `NEXT_PUBLIC_OPENAI_API_KEY` car cela exposerait votre clé côté client !

---

## 📖 Guide d'Utilisation

### 1️⃣ Connexion Vocale

1. Cliquez sur le bouton **"Micro"** (coin inférieur droit)
2. Autorisez l'accès au microphone
3. Attendez la connexion (bouton devient bleu)
4. Cliquez sur **"Parler"** pour commencer

### 2️⃣ Générer un Diagramme

**Exemple de commande vocale** :
> "Crée un diagramme avec un utilisateur qui appelle une API, l'API interroge une base de données, puis renvoie les résultats à l'utilisateur."

**L'IA va** :
- ✅ Comprendre votre description
- ✅ Générer le schéma (nodes + edges)
- ✅ Afficher sur le canvas avec auto-layout
- ✅ Ajouter une explication textuelle
- ✅ Vous répondre vocalement
104:

### 3️⃣ Optimisation (Coûts & Session)
Utiliser le bouton **"POUBELLE / RESET"** pour :
- Effacer le canvas
- **Réinitialiser le contexte IA** (Saves Tokens & $$$)
- Démarrer une nouvelle conversation "fraîche"

### 4️⃣ Modes de Développement
- **Mock Data** : Test sans API (fichier `lib/mockData.ts`) via E2E tests

---

## 🏗️ Architecture Technique

### Stack Technologique

| Couche | Technologies |
|--------|-------------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript 5 |
| **Styling** | Tailwind CSS 4 |
| **Canvas** | tldraw SDK 4.2 |
| **IA** | OpenAI Realtime API (WebSocket) |
| **Layout** | Dagre (auto-layout graphe) |
| **Validation** | Zod 4.1 |
| **Audio** | Web Audio API (PCM16, 24kHz) |

### Architecture en Couches (Hooks)

```
┌─────────────────────────────────────┐
│      useDiagramAgent.ts             │  ← Orchestration métier
│  (Business Logic Layer)             │
├─────────────────────────────────────┤
│  useRealtimeConnection.ts           │  ← Gestion WebSocket
│  (Connection Layer)                 │
├─────────────────────────────────────┤
│  useAudioRecorder.ts                │  ← Microphone + PCM16
│  useAudioPlayer.ts                  │  ← Lecture audio IA
>>>>>>> origin/enhance-diagram-visuals-bindings
│  (Audio Layer)                      │
└─────────────────────────────────────┘
```

<<<<<<< HEAD
**Pattern**: **Separation of Concerns**
- Each hook has a **single responsibility**.
- **Composability**: `useDiagramAgent` orchestrates others.
- **Testability**: Each layer can be tested independently.

---

## 📂 Project Structure

```
draw-by-voice/
├── src/                              # 🆕 All source code
│   ├── app/                          # Next.js App Router
│   │   ├── page.tsx                  # Main page with tldraw
│   │   ├── layout.tsx                # Global layout
│   │   ├── globals.css               # Global styles
│   │   └── api/
│   │       └── realtime/
│   │           └── session/
│   │               └── route.ts      # API Route (ephemeral session)
│   │
│   ├── features/                     # 🎯 Domain-based organization
│   │   ├── diagram/                  # Feature: Diagram Generation
│   │   │   ├── components/           # TldrawCanvas, AutoLayoutButton, etc.
│   │   │   ├── hooks/                # useDiagramAgent
│   │   │   ├── lib/                  # diagramGenerator, autoLayout, nodeTypeMapping
│   │   │   └── index.ts              # Public exports
│   │   │
│   │   └── voice/                    # Feature: Voice Control
│   │       ├── components/           # VoiceControl
│   │       ├── hooks/                # useRealtimeConnection, useAudioRecorder, useAudioPlayer
│   │       ├── lib/                  # functionDefinitions, systemPrompt
│   │       └── index.ts              # Public exports
│   │
│   ├── shared/                       # Shared code between features
│   │   ├── lib/
│   │   │   └── validation/
│   │   │       └── schemas.ts        # 🛡️ Zod Schemas
│   │   ├── types/                    # Centralized TypeScript types
│   │   │   └── index.ts
│   │   └── index.ts                  # Public exports
│   │
│   └── config/                       # Centralized configuration
│       ├── env.ts                    # Environment variables validation
│       └── site.ts                   # Site metadata
│
├── docs/                             # 📚 Documentation
│   ├── architecture/
│   │   └── ARCHITECTURE.md           # Technical documentation
=======
**Pattern** : **Separation of Concerns**
- Chaque hook a une **responsabilité unique**
- **Composabilité** : `useDiagramAgent` orchestre les autres
- **Testabilité** : Chaque couche peut être testée indépendamment

---

##  📂 Structure du Projet

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
│   ├── features/                     # 🎯 Organisation par domaine métier
│   │   ├── diagram/                  # Feature: Génération de diagrammes
│   │   │   ├── components/           # TldrawCanvas, AutoLayoutButton, DemoButton, TestButton
│   │   │   ├── hooks/                # useDiagramAgent
│   │   │   ├── lib/                  # diagramGenerator, autoLayout, nodeTypeMapping, mockData
│   │   │   └── index.ts              # Exports publics
│   │   │
│   │   └── voice/                    # Feature: Contrôle vocal
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
│       ├── env.ts                    # Validation variables d'environnement
│       └── site.ts                   # Métadonnées du site
│
├── docs/                             # 📚 Documentation
│   ├── architecture/
│   │   └── ARCHITECTURE.md           # Documentation technique
>>>>>>> origin/enhance-diagram-visuals-bindings
│   ├── guides/
│   │   ├── LOCAL_SETUP.md
│   │   └── CONTRIBUTING.md
│   ├── specs/
│   │   └── SPECIFICATIONS.md
<<<<<<< HEAD
│   └── media/                        # Media resources
│
├── public/                           # Static assets
├── .env.local.example                # Env vars template
├── package.json
├── tsconfig.json                     # TypeScript config
└── README.md                         # 👈 You are here
```

**Benefits of this structure**:
- ✅ **Feature-Based**: Code related to a feature is colocated.
- ✅ **Scalability**: Easy to add new features.
- ✅ **Boundaries**: Clear dependencies between modules.
- ✅ **Testability**: Each feature can be tested in isolation.

---

## 🔐 Security

### API Key Protection

✅ **Best Practice**:
```typescript
// ✅ API Route (Server)
const apiKey = process.env.OPENAI_API_KEY
```

❌ **Avoid**:
```typescript
// ❌ NEVER DO THIS!
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
```

### Data Validation

All AI data is validated with **Zod**:
=======
│   └── media/                        # Ressources média
│
├── public/                           # Assets statiques
├── .env.local.example                # Template variables d'env
├── package.json
├── tsconfig.json                     # Config TypeScript (strict mode + path aliases)
└── README.md                         # 👈 Vous êtes ici
```

**Avantages de cette structure** :
- ✅ **Feature-Based** : Tout le code d'une feature est colocalisé
- ✅ **Scalability** : Facile d'ajouter de nouvelles features
- ✅ **Boundaries** : Dépendances claires entre modules
- ✅ **Testability** : Chaque feature peut être testée isolément


---

## 🔐 Sécurité

### Protection de la Clé API

✅ **Bonne pratique** :
```typescript
// ✅ Route API (serveur)
const apiKey = process.env.OPENAI_API_KEY
```

❌ **À éviter** :
```typescript
// ❌ Ne JAMAIS faire ça !
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
```

### Validation des Données

Toutes les données de l'IA sont validées avec **Zod** :
>>>>>>> origin/enhance-diagram-visuals-bindings

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
<<<<<<< HEAD
    // User-friendly error message
    setError("The AI generated invalid data...")
=======
    // Message convivial pour l'utilisateur
    setError("L'IA a généré des données invalides...")
>>>>>>> origin/enhance-diagram-visuals-bindings
    return
}
```

---

<<<<<<< HEAD
## 🧪 Development

### Available Scripts

```bash
npm run dev      # Development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint linter
npx tsc --noEmit # TypeScript check
```

### Manual Tests

1. **WebSocket Connection**: Verify "✅ Connected to OpenAI" in console.
2. **Audio Input**: Speak and see transcriptions in logs.
3. **Audio Output**: Hear the AI respond vocally.
4. **Diagram Generation**: Dictate and verify canvas rendering.
5. **Validation**: Test with invalid data (friendly error message).

---

## 🔧 Advanced Configuration

### Modify AI Model

**`lib/systemPrompt.ts`**:
```typescript
export const SYSTEM_PROMPT = `
You are a software architecture expert...
`
```

### Add a Node Type

1. **`lib/schemas.ts`**: Add to `NodeTypeSchema`
```typescript
export const NodeTypeSchema = z.enum([
    'user', 'server', 'database', 'decision', 'step', 
    'cache' // 👈 New type
])
```

2. **`lib/nodeTypeMapping.ts`**: Configure appearance
=======
## 🧪 Développement

### Scripts Disponibles

```bash
npm run dev      # Serveur de développement (http://localhost:3000)
npm run build    # Build production
npm run start    # Serveur production
npm run lint     # Linter ESLint
npx tsc --noEmit # Vérification TypeScript
```

### Tests Manuels

1. **Connexion WebSocket** : Vérifier "✅ Connected to OpenAI" dans la console
2. **Audio Input** : Parler et voir les transcriptions dans les logs
3. **Audio Output** : Entendre l'IA répondre vocalement
4. **Génération Diagramme** : Dicter et vérifier l'affichage sur canvas
5. **Validation** : Tester avec données invalides (message d'erreur convivial)

### Debug

**Logs développement** : Tous les `console.log` sont enveloppés dans :
```typescript
if (process.env.NODE_ENV === 'development') {
    console.log('...')
}
```

**Environnement production** : Aucun log console.

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

1. **`lib/schemas.ts`** : Ajouter dans `NodeTypeSchema`
```typescript
export const NodeTypeSchema = z.enum([
    'user', 'server', 'database', 'decision', 'step',
    'cache' // 👈 Nouveau type
])
```

2. **`lib/nodeTypeMapping.ts`** : Configurer l'apparence
>>>>>>> origin/enhance-diagram-visuals-bindings
```typescript
cache: {
    color: 'orange',
    geo: 'rectangle',
    iconUrl: 'https://cdn.simpleicons.org/redis'
}
```

---

<<<<<<< HEAD
## 📚 Additional Documentation

- [Detailed Installation Guide](./docs/guides/LOCAL_SETUP.md)
- [Technical Specifications](./docs/specs/SPECIFICATIONS.md)
=======
## 📚 Documentation Complémentaire

- [Guide d'installation détaillé](./LOCAL_SETUP.md)
- [Spécifications techniques](./SPECIFICATIONS.md)
>>>>>>> origin/enhance-diagram-visuals-bindings
- [OpenAI Realtime API Docs](https://platform.openai.com/docs/guides/realtime)
- [tldraw SDK Docs](https://tldraw.dev)

---

## 🤝 Contribution

<<<<<<< HEAD
Contributions are welcome! To propose improvements:

1. **Fork** the project.
2. Create a **feature branch** (`git checkout -b feature/AmazingFeature`).
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`).
4. **Push** to the branch (`git push origin feature/AmazingFeature`).
5. Open a **Pull Request**.

### Pre-PR Checklist

- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)
- [ ] Build succeeds (`npm run build`)
- [ ] Lint passes (`npm run lint`)
- [ ] Code documented (JSDoc)
- [ ] Manual tests performed
=======
Les contributions sont les bienvenues ! Pour proposer des améliorations :

1. **Fork** le projet
2. Créez une **branche feature** (`git checkout -b feature/AmazingFeature`)
3. **Commit** vos changements (`git commit -m 'Add AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une **Pull Request**

### Checklist Avant PR

- [ ] TypeScript compile sans erreur (`npx tsc --noEmit`)
- [ ] Build réussit (`npm run build`)
- [ ] Lint passe (`npm run lint`)
- [ ] Code documenté (JSDoc)
- [ ] Tests manuels effectués
>>>>>>> origin/enhance-diagram-visuals-bindings

---

## 📝 Roadmap

<<<<<<< HEAD
- [ ] Multi-language support (i18n)
- [ ] Export PDF/PowerPoint
- [ ] Real-time collaboration (multi-user)
- [ ] History / Undo / Redo
- [ ] Diagram templates
- [ ] Dark mode
- [ ] Cloud save

---

## 📄 License

This project is licensed under the **MIT** License. See [LICENSE](./LICENSE) for details.

---

## 🙏 Acknowledgements

- [OpenAI](https://openai.com/) for the Realtime API
- [tldraw](https://tldraw.com/) for the excellent SDK
- [Dagre](https://github.com/dagrejs/dagre) for the layout algorithm
- [Vercel](https://vercel.com/) for Next.js hosting
=======
- [ ] Support multi-langues (i18n)
- [ ] Export PDF/PowerPoint
- [ ] Collaboration temps réel (multi-utilisateurs)
- [ ] Historique / Undo / Redo
- [ ] Templates de diagrammes
- [ ] Mode sombre
- [ ] Sauvegarde cloud

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir [LICENSE](./LICENSE) pour plus de détails.

---

## 🙏 Remerciements

- [OpenAI](https://openai.com/) pour l'API Realtime
- [tldraw](https://tldraw.com/) pour leur excellent SDK
- [Dagre](https://github.com/dagrejs/dagre) pour l'algorithme de layout
- [Vercel](https://vercel.com/) pour le hosting Next.js
>>>>>>> origin/enhance-diagram-visuals-bindings

---

## 📧 Contact

<<<<<<< HEAD
- **Author**: Aurélien Rodier
- **GitHub**: [@aurelienrodier](https://github.com/aurelienrodier)
=======
- **Auteur** : Aurélien Rodier
- **GitHub** : [@aurelienrodier](https://github.com/aurelienrodier)
>>>>>>> origin/enhance-diagram-visuals-bindings

---

<p align="center">
<<<<<<< HEAD
  Made with ❤️ and 🎤
=======
  Fait avec ❤️ et 🎤
>>>>>>> origin/enhance-diagram-visuals-bindings
</p>
