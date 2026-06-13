# 🇳🇬 NEIMS: National Election Intelligence Monitoring System

> **Zero-Trust Geopolitical Forecasting & Real-time Electoral Threat Intelligence Portal**

NEIMS (National Election Intelligence Monitoring System) is a secure, high-integrity forecasting platform designed for real-time risk assessment, threat analysis, and sentiment tracking across Nigeria’s 36 states and the Federal Capital Territory (FCT). 

Armed with sever-side generative intelligence and a hardened Zero-Trust database architecture, NEIMS keeps field analysts, decision-makers, and security operators fully synchronized—even in highly unstable, connection-challenged operational field environments.

---

## 🛰️ Core Capabilities

### 1. Geopolitical Threat forecasting
* **Comprehensive Territorial Mapping**: Real-time trend monitoring and hazard-coefficient regression for all 36 Nigerian states and the FCT.
* **Biased Sentiment Analysis**: Evaluates media, local reports, and signal intelligence to compile positive, neutral, and negative momentum indices.
* **Custom Threat Injector**: Allows authorized analysts to log local electoral signals with precise category tags, impact metrics, and rigorous source audits.

### 2. Zero-Trust Security & Multi-Tenant Isolation
* **Immunity to "The Dirty Dozen"**: Hardened Firestore rules block account takeovers, identity counterfeiting, extreme value injection (payload poisoning), and historical log tampering.
* **Secure Chat Logs**: Immutable query streams. Analysts can only view and subscribe to their own AI strategic guidance conversations, preventing cross-tenant information leaks.
* **Cryptographically Verified Attributes**: Immutable field metadata, validated client timestamps, and strict field bounds.

### 3. Server-Side AI Strategic Advisor
* **Integrated intelligence Panels**: Leverages the official Google GenAI SDK (`@google/genai`) to generate geopolitical threat assessments on-demand.
* **Secure Credential Separation**: No API keys are ever leaked to the browser. All Gemini interactions are proxied through a secure Express.js microservice.
* **Interactive Advisory Terminal**: Allows analysts to query current event alerts, state forecasting models, and receive immediate strategic assessments.

### 4. Resilient Offline-First Architecture
* **Tab-Synchronized Persistent Cache**: Utilizing Firestore's multiple-tab cache manager to store localized caches in IndexedDB.
* **Uninterrupted Operations**: Field analysts can read dashboards, view threat levels, and query pre-cached responses offline. When connection is restored, background events reconcile automatically.
* **Public Readiness**: Threat signals default to a public-read state for emergency stakeholder sharing.

---

## 🛠️ Technological Architecture

* **Frontend Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/) + [TypeScript](https://www.typescript.org/)
* **Styles & Animations**: [Tailwind CSS v4](https://tailwindcss.com/) + [Motion](https://motion.dev/) (Framer Motion)
* **Backend Runtime**: [Express.js](https://expressjs.com/) on Node.js + [esbuild](https://esbuild.github.io/) (High-speed production compiler)
* **Charts & Visualizations**: [Recharts](https://recharts.org/) + [Lucide React Icons](https://lucide.dev/)
* **Database & Auth**: [Firebase Client SDK](https://firebase.google.com/) (Auth, Firestore persistence)

---

## 📂 Project Structure

```bash
├── .env.example                # Example environment variable template
├── firebase-blueprint.json      # Declarative database rules and collection maps
├── firestore.rules             # Zero-Trust Firestore Security validation rules
├── package.json                # Project configurations, commands, and dependency tree
├── server.ts                   # Compliant Express.js + Vite middleware entry-point
├── tsconfig.json               # TypeScript path & compiler controls
├── vite.config.ts              # Vite configuration with Tailwind CSS compiling
├── src/
│   ├── firebase.ts             # Firebase client setup with multi-tab persistent cache
│   ├── main.tsx                # Client application root mount
│   ├── App.tsx                 # Base UI entry (Dashboard tabs, Map, Signals & Signals Form)
│   ├── components/
│   │   ├── FirebaseContext.tsx # Context for authentication state, chat logs, and database queries
│   │   ├── StateForecasts.tsx  # Map grid & analytical forecasting layout
│   │   ├── ThreatInsights.tsx  # Custom Threat signaler module
│   │   └── ExplainableSection.tsx # Chat interface with NEIMS AI Advisor (Gemini integration)
```

---

## 🚀 Local Installation & Setup

Ensure you have **Node.js v18+** installed before proceeding.

### 1. Clone & Install Dependencies
```bash
git clone <your-repository-url>
cd neims-dashboard
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file in the root directory (using `.env.example` as a template):
```bash
cp .env.example .env
```
Inside `.env`, define your secret credentials:
```env
# Secure backend Gemini API key (never shared with the browser)
GEMINI_API_KEY="your-google-gemini-api-key"

# Base URL indicator
APP_URL="http://localhost:3000"
```

### 3. Firebase Configuration
Make sure your client credentials are added to `firebase-applet-config.json` in the project root:
```json
{
  "apiKey": "your-api-key",
  "authDomain": "your-app.firebaseapp.com",
  "projectId": "your-app-id",
  "storageBucket": "your-app.appspot.com",
  "messagingSenderId": "your-sender-id",
  "appId": "your-app-id",
  "firestoreDatabaseId": "(default)"
}
```

---

## 🏃 Execution Commands

### Development mode
Starts the custom Express server inside an active TypeScript execution context (`tsx`) with Vite's hot-reload middleware enabled:
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the application.

### Production Build
Pipes the frontend React application through Vite's code-splitter, and compiles `server.ts` into a fast, bundled CommonJS script (`dist/server.cjs`) using `esbuild`:
```bash
npm run build
```

### Production Execution
Starts the production server cleanly from the compiled output folder:
```bash
npm start
```

---

## 🔒 The Zero-Trust Security Specification

The system is protected against the **Dirty Dozen** malicious payload vectors:

1. **Identity Hijacking**: Restricts writes inside `/userProfiles/{userId}` to matched ID states only.
2. **Elevation of Privilege**: Rejects unapproved fields (e.g. `clearanceLevel`) during profile writes.
3. **Mismatched Authentication Tokens**: Prevents reading target profiles unless `request.auth.uid` is accurate.
4. **Author Spoofing**: Blocks submissions inside `/customSignals` if `authorId` does not match the active auth state.
5. **Payload Size Poisoning**: Enforces strict size limitations (`size() <= 10000`) on text fields to prevent billing/storage inflation.
6. **Factual Regression Breakage**: Ensures numeric fields (`impact` and `aiConfidence`) reside inside the rigorous `[0, 100]` bound.
7. **Attribution Shifting**: Rejects any attempts to modify `id`, `createdAt`, or `authorId` fields on existing custom signals.
8. **Client Timestamp Forgeries**: Enforces validation checks on creation timestamps.
9. **Private Chat Scraping**: Rejects queries requesting `/chatHistory` lists owned by separate account credentials.
10. **Chat Impersonation**: Rejects messages that declare another user's authentication index.
11. **Chat Log Mutation**: Blocks modifying or deleting any historically logged message inside `/chatHistory`.
12. **System Database Injections**: Validates documents with standard constraints to prevent regex injection errors and bad database keys.

---

## 📝 License
This project is proprietary and intended for verified analysts. Maintain full discretion during redistribution.
