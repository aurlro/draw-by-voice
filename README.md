# 🎨 Draw by Voice

> Generate software architecture diagrams by voice command using AI

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-Realtime%20API-green?logo=openai)](https://platform.openai.com/docs/)

**Draw by Voice** is an innovative web application that transforms your voice descriptions into professional architecture diagrams. Speak naturally, and the AI understands and automatically generates clear and organized schemas.

![Demo](https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Demo+Screenshot)

---

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

### Installation

```bash
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
OPENAI_API_KEY=sk-proj-...
```

> [!WARNING]
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
│  (Audio Layer)                      │
└─────────────────────────────────────┘
```

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
│   ├── guides/
│   │   ├── LOCAL_SETUP.md
│   │   └── CONTRIBUTING.md
│   ├── specs/
│   │   └── SPECIFICATIONS.md
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
    // User-friendly error message
    setError("The AI generated invalid data...")
    return
}
```

---

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
```typescript
cache: {
    color: 'orange',
    geo: 'rectangle',
    iconUrl: 'https://cdn.simpleicons.org/redis'
}
```

---

## 📚 Additional Documentation

- [Detailed Installation Guide](./docs/guides/LOCAL_SETUP.md)
- [Technical Specifications](./docs/specs/SPECIFICATIONS.md)
- [OpenAI Realtime API Docs](https://platform.openai.com/docs/guides/realtime)
- [tldraw SDK Docs](https://tldraw.dev)

---

## 🤝 Contribution

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

---

## 📝 Roadmap

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

---

## 📧 Contact

- **Author**: Aurélien Rodier
- **GitHub**: [@aurelienrodier](https://github.com/aurelienrodier)

---

<p align="center">
  Made with ❤️ and 🎤
</p>
