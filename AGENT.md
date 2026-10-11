# AGENT.md - BIS Sentinel Project Context & Architecture

## Project Overview
**App Name**: BIS Sentinel – Consumer Checker  
**Platform**: Mobile-First Progressive Web App (PWA), cleanly centered and distraction-free  
**Primary User**: Meera, 34, Coimbatore. Android phone, patchy network, reads Tamil comfortably and English adequately. Non-technical, wary of wrongly accusing sellers.

## Non-Negotiable Core Principles & Copy Rules
- **Tone**: Calm, trustworthy, civic-tech, neutral, non-alarmist.
- **Forbidden Words**: NEVER use "fake", "fraud", "genuine", or "counterfeit" anywhere in the UI or AI responses.
- **Forbidden Imagery**: Never use red-and-skull imagery or aggressive warning signs.
- **Result Philosophy**: Not a binary pass/fail. A check against available official records, NOT a legal finding. Never show a numeric authenticity score.
- **SCOPE-4 Framework**:
  1. Claim (Presence & visual syntax of standard mark claim)
  2. Identity (Brand and manufacturer match)
  3. Scope (Product category and variety match)
  4. Time (Validity window coverage)

## Key Layout & UI Decisions
1. **Clean Centered Consumer Layout**: All unnecessary desktop side panels and cards removed. The interface is clean, focused, and centered on all devices.
2. **SCOPE-4 Grid Layout**: 2x2 spacious grid preventing any text collisions or overlapping tags.
3. **Real Internet Assets**: Official Bureau of Indian Standards (BIS) and ISI mark SVGs sourced from Wikimedia Commons, plus authentic product photos.
4. **Tactile Bubble Controls**: Rounded-full pill buttons, bubble camera shutter button, and bubble category chips.
5. **Discreet Demo Presets**: Collapsible drawer in bottom corner for live reviewer demonstrations without exposing test tags to regular users.

## Tech Stack
- **Database**: SQLite 3 (`bis_sentinel.db`) with WAL journal mode
- **Backend API**: Integrated Vite dev middleware (`server/database.js`, `server/apiRouter.js`)
- **Framework**: React 18 (JSX/JavaScript)
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS + custom design tokens (Noto Sans, Noto Sans Tamil, Noto Sans Devanagari)
- **Navigation**: React Router v6
- **State Management**: Zustand
- **Async & Data**: TanStack Query (React Query)
- **Internationalization**: `react-i18next` with full English, Tamil (தமிழ்), and Hindi (हिंदी) translations
- **Icons**: Lucide React
- **Chatbot & AI**: Multilingual "Sentinel Sahayak" with Google Gemini API & Web Speech API (STT & TTS)
- **PWA**: PWA Web Manifest + Service Worker offline shell support (`vite-plugin-pwa`)
