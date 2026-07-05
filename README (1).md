# Post Repurposer — LinkedIn Growth Agent

An intelligent, full-stack AI content repurposing agent built in **React, TypeScript, Express, and Tailwind CSS**, powered by the **Gemini 3.5 Flash** model via the official `@google/genai` SDK.

This application is a Capstone submission for the AI Agents: Intensive Vibe Coding course. It demonstrates agentic reasoning with structured output, server-side security, and one-click deployability on Google Cloud Run.

**Track:** Agents for Business

---

## 🚀 Key Deliverables

- **Live Public App:** https://post-repurposer-196549913420.us-west1.run.app
- **Framework & Technology Stack:** React 19, TypeScript, Vite, Express, Tailwind CSS, Lucide Icons, and `@google/genai`.

---

## 💡 The Problem & Solution

### The Problem
Professionals and content creators spend hours researching and writing high-value, long-form insights on LinkedIn. However, LinkedIn's feed rewards different formats in different ways:
1. **Diverse formats win:** Visual multi-page carousels tend to see higher engagement than plain text.
2. **Attention spans are low:** Mobile users prefer punchy, skimmable 3–4 line posts rather than dense essays.
3. **Comments drive reach:** Early discussion in the comments helps a post gain momentum.

Manually converting a single long essay into slides, a mobile-optimized draft, and engagement questions is an exhausting chore that requires structured copywriting skills.

### The Solution: The Post Repurposer Agent
This application acts as a digital content strategist. It takes any raw essay or company milestone post and decomposes it through structured agent reasoning into a multi-asset growth package:
- **Core reasoning engine:** Identifies the underlying message, target audience, and ideal tone.
- **Slide carousel plan:** Outputs a 5-to-7 slide storyboard with an attention-grabbing hook slide, logical mid-slides, and a clean call-to-action (CTA).
- **Short-form organic draft:** Condenses the argument into a skimmable, sub-60-word micro-post.
- **Comment hooks:** Generates 3 discussion-sparking questions to copy and pin into the comments section.

---

## 🛠️ System Architecture & Capstone Concepts

This project demonstrates three of the course's key concepts. (A fourth, Antigravity, is also present — see the note below.)

### 1. Structured-Reasoning Agent
Rather than wrapping a simple text-generation prompt, the agent actively reasons using **Gemini 3.5 Flash** and commits to a structured plan of action. We leverage Gemini's **JSON response schema** to enforce a reliable output structure on the generative result. This guarantees that the UI can parse and render distinct cards for the analysis, carousel, short-form draft, and comment hooks without crashing or emitting unstructured markdown. The reasoning step (core message → audience → tone) runs before the formatting step, which is what makes this an agent rather than a single-shot prompt.

### 2. Server-Side Security Architecture
In alignment with enterprise-grade best practices, **API keys are strictly hidden from the browser**.
- All communication with the Gemini API is proxied through a secure Express router endpoint `/api/repurpose`.
- The frontend client never touches, receives, or exposes the sensitive `GEMINI_API_KEY` secret.
- **Lazy client initialization:** The server spins up the Google GenAI SDK client only when the endpoint is hit, preventing crash-on-startup failures if key variables are briefly unconfigured in the deployment sandbox.

### 3. Deployability
The application is deployed to **Google Cloud Run** directly from Google AI Studio's one-click publish flow. The build is containerized and served by the Express runtime, producing a public, scalable URL that requires no login or paywall to access. Reproduction instructions are in the Setup section below.

> **Bonus — Antigravity:** This app was built in Google AI Studio's Build mode, whose agent harness is powered by the Google Antigravity Agent. The Antigravity agent handled multi-file generation and dependency management across the React frontend and Express backend during development.

---

## 🎨 Interface & UX

The interface uses a professional high-density layout to keep the whole workflow on one screen:
- **Three-column dashboard:** Structured left-to-right from source input, to deep analysis, to the carousel storyboard and short-form/comment drafts.
- **Fully interactive workspace:** Every generated item — from slide headers to comment hooks — is editable in place, so creators can polish copy before publishing.
- **One-click clipboard copies:** Quick-copy triggers grab either individual slides or the entire carousel sequence at once.
- **Adaptive sample presets:** Quick-loading templates allow rapid testing on topics like "$1M ARR journeys," "tech burnout," or "design minimalism."

---

## 📂 Project Structure

```bash
├── .env.example         # System environment variables template
├── index.html           # Single Page App index wrapper
├── metadata.json        # Google AI Studio application configurations
├── package.json         # Build commands & system dependencies
├── server.ts            # Node.js Express full-stack proxy & asset server
├── tsconfig.json        # TypeScript configuration file
├── vite.config.ts       # Vite bundler configuration & HMR rules
└── src/
    ├── main.tsx         # React application entry-point
    ├── index.css        # Global CSS stylesheet importing Tailwind
    ├── App.tsx          # Full interactive repurposer dashboard component
    └── types.ts         # Type safety interfaces for API schemas
```

---

## ⚙️ Setup and Installation

### 1. Prerequisites
- **Node.js** (v18.x or newer)
- **NPM** (v9.x or newer)

### 2. Install Dependencies
Clone this repository or export the project, then run:
```bash
npm install
```

### 3. Configure Secrets
Create a `.env` file in the project root directory, or supply the environment variable during deployment:
```env
GEMINI_API_KEY="your_actual_google_gemini_api_key_here"
```

### 4. Run the Dev Server
The full-stack development environment mounts Vite as middleware inside the Node Express runtime on port `3000`. Launch it with:
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 5. Build for Production
To bundle the frontend assets and compile the Express TypeScript backend:
```bash
npm run build
```
Once built, run the production build with:
```bash
npm run start
```

### 6. Deploy to Cloud Run
This app is deployed via Google AI Studio's **Publish → Publish App** flow, which containerizes the build and hosts it on Google Cloud Run. To reproduce, open the project in AI Studio Build mode and click Publish; the `GEMINI_API_KEY` is injected server-side automatically.

---

## 🔒 Security & Guardrails

1. **User input sanitation:** The backend validates and rejects empty inputs or malformed payloads before issuing token requests.
2. **API isolation:** API keys are never stored, logged, or sent client-side.
3. **Structured back-offs:** Handles JSON parsing retries cleanly if network issues occur or API limits are met.
