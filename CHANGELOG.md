# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] - 2025-12-03

### 🎉 Initial Release

First public version of Draw by Voice with complete voice-to-diagram functionality.

### ✨ Added

#### Core Features
- **Voice Control** : Real-time conversation with OpenAI Realtime API
- **Diagram Generation** : Auto-layout with Dagre algorithm
- **Audio I/O** : Bidirectional audio (speak + hear AI responses)
- **Canvas** : Infinite canvas powered by tldraw SDK
- **Demo Mode** : Pre-configured examples (AWS, Login Flow, CI/CD)

#### Architecture
- **Layered Hook Architecture** :
  - `useDiagramAgent.ts` - Business logic orchestration
  - `useRealtimeConnection.ts` - WebSocket management
  - `useAudioRecorder.ts` - Microphone + PCM16 encoding
  - `useAudioPlayer.ts` - AI audio output playback
- **Separation of Concerns** : Clean, testable, maintainable code
- **Type Safety** : Full TypeScript with strict mode

#### Security
- **Server-side API Key** : Using `OPENAI_API_KEY` (not `NEXT_PUBLIC_*`)
- **Zod Validation** : Runtime schema validation for all external data
- **User-friendly Errors** : Graceful error handling with clear messages
- **Zero Exposure** : Ephemeral tokens for client WebSocket connections

#### Developer Experience
- **TypeScript Strict Mode** : Zero implicit `any`
- **Clean Console** : Development logs wrapped in `NODE_ENV` checks
- **Resource Cleanup** : Automatic cleanup of WebSocket, AudioContext
- **Documented Code** : JSDoc on all public functions

### 🛠 Technical Stack

- **Framework** : Next.js 16.0 (App Router)
- **React** : 19.2
- **TypeScript** : 5.0
- **Canvas** : tldraw 4.2
- **AI** : OpenAI Realtime API
- **Layout** : Dagre 0.8.5
- **Validation** : Zod 4.1
- **Styling** : Tailwind CSS 4

### 📚 Documentation

- Comprehensive README with architecture diagrams
- Technical ARCHITECTURE.md
- Contribution guidelines (CONTRIBUTING.md)
- Installation guide (LOCAL_SETUP.md)

### 🐛 Fixed

- Infinite loop in `useDiagramAgent` cleanup
- TypeScript errors with Float32Array audio buffers
- API key exposure vulnerability (migrated to server-only)

---

## [Unreleased]

### Planned Features

- [ ] Multi-language support (i18n)
- [ ] Dark mode
- [ ] Export to PDF/PowerPoint
- [ ] Real-time collaboration
- [ ] Diagram templates library
- [ ] Undo/Redo history
- [ ] Cloud save

---

[0.1.0]: https://github.com/aurelienrodier/draw-by-voice/releases/tag/v0.1.0
