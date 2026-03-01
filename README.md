# 🤖 AI Customer Support Chatbot

> **Deflect tickets. Delight customers. Ship support that scales.**

Production-grade AI customer support chatbot interface with real-time conversation flows, widget embed preview, and analytics dashboard — built with Next.js 15 and TypeScript.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-nackin--ai--chatbot.vercel.app-4f46e5?style=flat-square&logo=vercel)](https://nackin-ai-chatbot.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js_15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> ⚠️ **Demo Version** — Based on a production system built for a real client. Sensitive data and proprietary business logic have been removed.

---

## 📸 Screenshots

| Chat Interface | Widget Mode | Analytics |
|---|---|---|
| `public/screenshot-chat.png` | `public/screenshot-widget.png` | `public/screenshot-analytics.png` |

---

## ✨ Features

| Feature | Status |
|---------|--------|
| 💬 Real-time style chat with typing indicators | ✅ |
| 🧵 Multi-thread conversation history sidebar | ✅ |
| 🛍 Pre-built flows: orders, refunds, tech support | ✅ |
| 🪟 Widget embed preview over website mock | ✅ |
| 🎨 Live customization panel (name, colors, avatar) | ✅ |
| 📊 Analytics dashboard with KPI cards & charts | ✅ |
| 🌙 Dark / light mode | ✅ |
| 📱 Mobile-first responsive layout | ✅ |
| ⚡ Zero-config — no API key needed for demo | ✅ |

### Chat Flows

- **Product questions** — FAQ-style answers with smart suggestions
- **Order status** — Simulated lookup with tracking info
- **Refund requests** — Multi-step guided flow with confirmation
- **Technical support** — Escalation path with ticket creation

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Components** | shadcn/ui architecture |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Theming** | next-themes |
| **Deployment** | Vercel |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/nackin-io/nackin-ai-chatbot.git
cd nackin-ai-chatbot
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 3. Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
nackin-ai-chatbot/
├── app/
│   ├── layout.tsx          # Root layout with theme provider
│   └── page.tsx            # Main app entry point
├── components/
│   ├── chatbot-demo.tsx    # Main chatbot UI (chat, widget, analytics tabs)
│   ├── theme-toggle.tsx    # Dark/light mode toggle
│   ├── theme-provider.tsx  # next-themes provider wrapper
│   └── ui/                 # shadcn/ui primitives
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── separator.tsx
│       ├── tabs.tsx
│       └── textarea.tsx
├── lib/
│   └── utils.ts            # cn() utility (clsx + tailwind-merge)
├── public/                 # Static assets
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🎯 How It Works

1. **Chat Tab** — Users interact with a simulated AI agent. Each message triggers a pre-built response flow after a realistic typing delay.
2. **Widget Tab** — Preview how the chatbot looks embedded on a customer's website as a floating widget.
3. **Analytics Tab** — KPI cards (conversations, response time, CSAT, resolution rate) backed by mock data with Recharts visualizations.
4. **Settings Panel** — Customize bot name, avatar, welcome message and brand color in real time.

---

## 📊 Analytics Metrics (Demo)

| Metric | Value |
|--------|-------|
| Conversations today | 1,247 |
| Avg response time | 1.4s |
| Satisfaction score | 4.8 / 5 |
| Resolution rate | 87% |

---

## 🧪 Tests

```bash
npm run test
```

Tests cover utility functions, component rendering, and conversation flow logic.

---

## 📄 License

MIT — free for personal and commercial use.

---

> Built by [**Nackin**](https://nackin.io) — AI Engineering & Full-Stack Development Studio
