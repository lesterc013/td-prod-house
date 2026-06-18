# TD Prod House — Stage 1 RAG Learning Project

## What this repo is
A deliberately minimal, hands-on RAG (retrieval-augmented generation) project, built to learn the mechanics before scaling up. It is NOT the final product — it's the proving ground for "TD Prod House," a longer-term system that will eventually take in documentation (PDFs, slide decks) and produce instructional slides and videos. This repo's scope is just: upload-style documents in, ask questions, get answers grounded in those documents.

## Stack & environment
- Plain JavaScript, ES modules (`"type": "module"` in package.json). No TypeScript yet — deliberate, to avoid adding tooling overhead while the RAG mechanics themselves are still new. TypeScript gets introduced later when this is rebuilt as the real Express backend.
- Node's built-in `fetch` for all HTTP calls. No axios, no Ollama SDK wrapper.
- Native Windows (not WSL) for local dev. Chosen deliberately to skip WSL GPU passthrough setup, which added no value for a single-machine learning script.
- Local LLM via Ollama, running on Windows natively. First time using Ollama — do not assume prior familiarity with its CLI or API.
  - Embedding model: `nomic-embed-text`
  - Generation model: `qwen2.5:14b` or `mistral-nemo:12b` (chosen over `llama3.1:8b` for more reliable "answer only from this context" instruction-following — matters for telling apart bad retrieval from bad generation). Dev machine has 16GB+ VRAM.
  - Ollama API base: `http://localhost:11434` — `/api/embed` for embeddings, `/api/generate` for generation.

## Working style — important for how to assist
- Wants to write core/conceptual logic himself (similarity functions, retrieval logic, the actual RAG flow). Give scaffolding, API shapes, setup commands, and config freely — but let him write the algorithmic logic, and review/critique it rather than writing it first.
- Prefers being told what's wrong or what smells exist without being handed the directional fix outright.
- Values understanding the "why" behind a decision, not just the decision.
- When there's a genuine implementation choice, appreciates a "simple option" and a "more structured/pattern-based option" laid out with a recommendation, rather than one prescribed path.

## Design principles in force (default to these; don't suggest upgrades unprompted)
- One new concept at a time. Don't introduce chunking, file storage, PDF parsing, or a server layer until the simpler version one step before it is proven working.
- Brute-force before optimized: a plain in-memory array plus a hand-written cosine similarity function — not a vector database. Revisit only once there are enough chunks that brute-force search is actually slow.
- JSON file storage before Postgres. Postgres/pgvector is an explicit later upgrade, not a prerequisite.
- "Documents" at this stage are hardcoded JS strings, not real PDFs. Real PDF parsing (`pdf-parse`) comes only after the embed → store → retrieve → generate loop works end to end on strings.
- Chunking comes after the basic pipeline works, not before — it's a text-prep concern, separate from the core RAG loop being learned right now.

## Explicitly deferred — don't build or suggest unless asked
- TypeScript, Express routes, frontend (later phases, in that order)
- Vector databases (pgvector, Qdrant, etc.), Postgres
- Reranking, hybrid/BM25 search, multi-tenancy, retrieval evaluation metrics
- Docker for Ollama itself (Docker is fine later for the Node app, not for Ollama on a single box)
- Deployment topology — LAN server, SSH/Tailscale, pm2/systemd/NSSM, etc. Already thought through conceptually (target: a 24/7 office LAN server other devices reach over WiFi, no public exposure) but intentionally not being built until the local pipeline + Express app work end-to-end first.

## Background
Software engineer (~1.5 years in, career-switched from 6 years as a Naval Officer), building this as a self-directed side project alongside The Odin Project's JavaScript curriculum. Comfortable with SOLID principles and applies them deliberately once underlying mechanics are understood — not before (e.g. Strategy pattern for swappable document parsers, dependency inversion for LLM provider/vector store, are intentional later refactors, not starting points).
