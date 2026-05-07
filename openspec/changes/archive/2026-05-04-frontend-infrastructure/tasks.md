# Tasks: Frontend Infrastructure

## 1. Project Setup

- [x] 1.1 Create Vite + React + TypeScript project (`npm create vite@latest frontend --template react-ts`)
- [x] 1.2 Install dependencies (React, TypeScript, Vite, Tailwind, Zustand, Axios)
- [x] 1.3 Configure package.json scripts (dev, build, preview, lint)
- [x] 1.4 Configure tsconfig.json with strict mode and path aliases

## 2. Tailwind CSS Configuration

- [x] 2.1 Install Tailwind CSS (`npm install -D tailwindcss postcss autoprefixer`)
- [x] 2.2 Initialize Tailwind (`npx tailwindcss init -p`)
- [x] 2.3 Configure tailwind.config.js with Food Store theme (colors, fonts)
- [x] 2.4 Add Tailwind directives to index.css
- [x] 2.5 Create base styles (reset, typography)
- [x] 2.6 Create cn() utility for className merging

## 3. FSD Folder Structure

- [x] 3.1 Create app/ directory (providers, routes)
- [x] 3.2 Create pages/ directory (Home, Cart, Profile)
- [x] 3.3 Create widgets/ directory (Header, Footer, ProductCard)
- [x] 3.4 Create features/ directory (auth, cart, checkout)
- [x] 3.5 Create entities/ directory (product, user, cart)
- [x] 3.6 Create shared/ directory (ui, utils, api)

## 4. Vite Configuration

- [x] 4.1 Configure vite.config.ts with aliases (@/*)
- [x] 4.2 Add API proxy for development
- [x] 4.3 Configure environment variables (.env, .env.example)
- [x] 4.4 Add build optimization plugins

## 5. Zustand Stores

- [x] 5.1 Install Zustand (`npm install zustand`)
- [x] 5.2 Create authStore with persist middleware
- [x] 5.3 Create cartStore with items array
- [x] 5.4 Create paymentStore (status, orderId)
- [x] 5.5 Create uiStore (toasts, modals, theme)

## 6. Axios Client

- [x] 6.1 Install Axios (`npm install axios`)
- [x] 6.2 Create api client instance
- [x] 6.3 Configure base URL from environment
- [x] 6.4 Add request interceptor (auth header)
- [x] 6.5 Add response interceptor (401 handling)
- [x] 6.6 Export typed API methods

## 7. Entry Point & Router

- [x] 7.1 Configure main.tsx entry point
- [x] 7.2 Install React Router (`npm install react-router-dom`)
- [x] 7.3 Create App.tsx with Router provider
- [x] 7.4 Create basic route definitions

## 8. Verification

- [x] 8.1 Run `npm run dev` and verify no errors
- [x] 8.2 Test build (`npm run build`) succeeds
- [x] 8.3 Verify Tailwind classes apply correctly
- [x] 8.4 Verify Zustand stores persist to localStorage
- [x] 8.5 Verify Axios interceptors are set up