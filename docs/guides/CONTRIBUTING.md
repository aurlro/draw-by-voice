# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer à **Draw by Voice** ! Ce document vous guidera à travers le processus de contribution.

---

## 🚀 Démarrage Rapide

### 1. Fork & Clone

```bash
# Fork le projet sur GitHub
# Puis clonez votre fork
git clone https://github.com/YOUR_USERNAME/draw-by-voice.git
cd draw-by-voice
```

### 2. Installation

```bash
npm install
cp .env.local.example .env.local
# Ajoutez votre OPENAI_API_KEY dans .env.local
npm run dev
```

### 3. Créer une Branche

```bash
git checkout -b feature/ma-fonctionnalite
# ou
git checkout -b fix/mon-correctif
```

---

## 📝 Standards de Code

### TypeScript Strict Mode

Le projet utilise TypeScript en **mode strict** :
- ✅ Pas d'`any` implicite
- ✅ Tous les types doivent être explicites
- ✅ Validation runtime avec Zod

```typescript
// ✅ Bon
function processData(data: DiagramData): void {
    const result = DiagramDataSchema.safeParse(data)
    if (!result.success) return
    // ...
}

// ❌ Mauvais
function processData(data: any) {
    // ...
}
```

### Naming Conventions

| Type | Convention | Exemple |
|------|-----------|---------|
| **Composants** | PascalCase | `VoiceControl.tsx` |
| **Hooks** | camelCase, `use` prefix | `useDiagramAgent.ts` |
| **Types/Interfaces** | PascalCase | `DiagramData`, `NodeType` |
| **Constantes** | SCREAMING_SNAKE_CASE | `SYSTEM_PROMPT` |
| **Fonctions** | camelCase | `generateDiagram()` |

### Documentation

Tous les hooks et fonctions publiques doivent avoir une **JSDoc** :

```typescript
/**
 * Hook pour gérer la connexion WebSocket OpenAI Realtime API
 * 
 * @param sessionConfig - Configuration de la session
 * @returns État et méthodes de contrôle
 * 
 * @example
 * ```tsx
 * const { state, connect } = useRealtimeConnection({
 *     sessionConfig: { tools: [...] }
 * })
 * ```
 */
export function useRealtimeConnection(props) {
    // ...
}
```

---

## 🏗️ Architecture

### Ajout d'un Nouveau Hook

Les hooks doivent suivre le pattern **Separation of Concerns** :

```typescript
// hooks/useMonNouveauHook.ts
'use client'

import { useState, useCallback } from 'react'

export function useMonNouveauHook() {
    const [state, setState] = useState(...)
    
    // ✅ Toujours useCallback pour les fonctions
    const maFonction = useCallback(() => {
        // ...
    }, [dependencies])
    
    return { state, maFonction }
}
```

### Ajout d'un Type de Nœud

1. **Schéma Zod** (`lib/schemas.ts`)
```typescript
export const NodeTypeSchema = z.enum([
    'user', 'server', 'database', 'decision', 'step',
    'cache' // 👈 Nouveau type
])
```

2. **Mapping Visuel** (`lib/nodeTypeMapping.ts`)
```typescript
export const NODE_TYPE_CONFIGS: Record<NodeType, NodeTypeConfig> = {
    // ...
    cache: {
        color: 'orange',
        geo: 'rectangle',
        iconUrl: 'https://cdn.simpleicons.org/redis'
    }
}
```

3. **Documentation Tool** (`lib/functionDefinitions.ts`)
```typescript
enum: ['user', 'server', 'database', 'decision', 'step', 'cache'],
description: 'Type of node: ..., cache (caching layer)'
```

---

## ✅ Checklist Avant PR

### Tests

- [ ] **TypeScript** : `npx tsc --noEmit` (0 erreurs)
- [ ] **Build** : `npm run build` (succès)
- [ ] **Lint** : `npm run lint` (0 warnings)

### Tests Manuels

- [ ] Connexion WebSocket fonctionne
- [ ] Enregistrement audio fonctionne
- [ ] Lecture audio IA fonctionne
- [ ] Génération diagramme fonctionne
- [ ] Messages d'erreur affichés correctement
- [ ] Pas de régression sur fonctionnalités existantes

### Code Quality

- [ ] Code documenté (JSDoc sur fonctions publiques)
- [ ] Pas de `console.log` sans `if (NODE_ENV === 'development')`
- [ ] Pas d'`any` TypeScript non justifié
- [ ] Cleanup des ressources (useEffect)
- [ ] Performance vérifiée (useCallback/useMemo)

---

## 📦 Processus de PR

### 1. Commit Messages

Format : **Conventional Commits**

```bash
# Features
git commit -m "feat: add voice volume control"

# Bug fixes
git commit -m "fix: resolve infinite loop in useDiagramAgent"

# Documentation
git commit -m "docs: update README with new examples"

# Refactoring
git commit -m "refactor: extract audio logic into useAudioPlayer"

# Performance
git commit -m "perf: optimize node rendering with useMemo"
```

### 2. Description de la PR

**Template** :

```markdown
## 🎯 Objectif

Brève description de ce que fait cette PR.

## 🔧 Changements

- Ajout de `useMonHook.ts`
- Modification de `VoiceControl.tsx` pour...
- Correction du bug de...

## 🧪 Tests Effectués

- [x] Connexion WebSocket
- [x] Génération diagramme
- [x] Build production

## 📸 Screenshots (si UI)

![screenshot](url)
```

### 3. Review Process

1. **Automated checks** : TypeScript, Build, Lint (GitHub Actions)
2. **Code review** : Mainteneur examine le code
3. **Tests** : Vérification manuelle si nécessaire
4. **Merge** : Squash & Merge dans `main`

---

## 🐛 Signaler un Bug

### Template d'Issue

```markdown
## 🐛 Description du Bug

Description claire et concise du problème.

## 📋 Étapes pour Reproduire

1. Aller sur '...'
2. Cliquer sur '...'
3. Voir l'erreur

## 🎯 Comportement Attendu

Ce qui devrait se passer normalement.

## 📸 Screenshots

Si applicable.

## 🖥️ Environnement

- OS: [e.g. macOS, Windows]
- Navigateur: [e.g. Chrome 120]
- Node version: [e.g. 20.10.0]
```

---

## 💡 Proposer une Fonctionnalité

### Template d'Issue

```markdown
## 💡 Fonctionnalité

Description de la fonctionnalité souhaitée.

## 🎯 Problème Résolu

Quel problème cette fonctionnalité résout-elle ?

## 🔧 Solution Envisagée

Comment imaginez-vous cette fonctionnalité ?

## 🤔 Alternatives

Autres solutions envisagées.
```

---

## 🎨 Standards UI/UX

### Composants

- Utiliser **Tailwind CSS** pour le styling
- Suivre la palette de couleurs existante
- Responsive design (mobile-first)

### Accessibilité

- Tous les boutons doivent avoir un `aria-label`
- Utiliser des couleurs avec bon contraste
- Support clavier (Tab, Enter, Esc)

```tsx
<button
    onClick={handleClick}
    aria-label="Start voice recording"
    className="..."
>
    🎤 Micro
</button>
```

---

## 🔒 Sécurité

### Règles Critiques

1. **Jamais de clés API côté client**
   ```typescript
   // ❌ INTERDIT
   const key = process.env.NEXT_PUBLIC_OPENAI_API_KEY
   
   // ✅ Uniquement serveur
   const key = process.env.OPENAI_API_KEY
   ```

2. **Toujours valider les données externes**
   ```typescript
   const result = schema.safeParse(externalData)
   if (!result.success) return
   ```

3. **Sanitize user input** (si ajout de features avec input texte)

---

## 📚 Ressources

- [Architecture Documentation](./ARCHITECTURE.md)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [React Docs](https://react.dev)
- [Next.js Docs](https://nextjs.org/docs)
- [Zod Docs](https://zod.dev)

---

## 🙏 Merci !

Votre contribution rend **Draw by Voice** meilleur pour tous. N'hésitez pas à poser des questions dans les issues ou discussions GitHub.

---

<p align="center">
  <strong>Happy Coding! 🚀</strong>
</p>
