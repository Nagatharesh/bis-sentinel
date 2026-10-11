# BIS Sentinel – Consumer Checker 🇮🇳

A mobile-first Progressive Web App (PWA) designed for Indian shoppers to verify whether a product's BIS Standard Mark claim (ISI, CRS, Hallmark) is consistent with available official records.

Designed with a calm, trustworthy civic-tech aesthetic. Features a multilingual voice-enabled AI companion (**Sentinel Sahayak**) with Gemini API integration and native Web Speech API (English, தமிழ், हिंदी).

---

## 🗄️ SQLite Database Architecture

The application now uses a dedicated **SQLite 3 database** (`bis_sentinel.db`) with Write-Ahead Logging (WAL) for high reliability and performance.

### Database Tables:
1. **`checks`**: Stores all verified scenarios and user inspection records (including SCOPE-4 dimension JSON, OCR bounding boxes, record comparison matrices, and cryptographic evidence hashes).
2. **`reports`**: Stores submitted grievances formatted for the BIS Care portal, reviewer assignment stages, and officer review notes.
3. **`collection_points`**: Stores authorized municipal and brand e-waste recycling depots with coordinates and accepted categories in Coimbatore.

### API Endpoints (Powered by SQLite):
- `GET /api/checks`: Retrieve all inspection records from SQLite.
- `GET /api/checks/:id`: Lookup scenario or check by ID from SQLite.
- `POST /api/checks`: Insert new user inspection record into SQLite.
- `GET /api/reports`: Retrieve grievance tickets with review stages from SQLite.
- `POST /api/reports`: Log a new grievance complaint into SQLite.
- `PATCH /api/reports/:id/evidence`: Attach additional evidence to an existing report.
- `GET /api/collection-points`: Fetch Coimbatore recycling centers from SQLite.
- `GET /api/stats`: Return SQLite database statistics (`totalChecks: 8`, `totalReports: 3`).

---

## 🌟 Key Features

1. **SCOPE-4 Verification Matrix**:
   - **Claim**: Presence and visual syntax of standard mark.
   - **Identity**: Match between brand/packaging and registered licence holder.
   - **Scope**: Category authorization (e.g. helmets vs automotive brake fluid).
   - **Time**: Active validity window and batch alignment.

2. **4 Pre-loaded Scenarios Seeded in SQLite**:
   - **Scenario 1 ("No mismatch detected in the available evidence")**: Electric Kettle (`CM/L-8400123`), IS 302-2-15, all dimensions supported.
   - **Scenario 2 ("Possible inconsistency requiring review")**: Motorcycle Helmet (`CM/L-7200456`), licence issued for automotive brake fluid / different manufacturer.
   - **Scenario 3 ("Unable to verify with available records")**: Fast Charger (`CM/L-72??914`), unreadable/partial digits under glare with inline correction editor.
   - **Scenario 4 ("Environmental claim requires separate verification")**: 5-Star Refrigerator (`CM/L-9100234`), safety mark valid + BEE energy registry guide + Coimbatore E-Waste collection points.

3. **Multilingual Voice AI Companion ("Sentinel Sahayak")**:
   - **Languages**: English, தமிழ் (Tamil), हिंदी (Hindi).
   - **Google Gemini API**: Full integration via `VITE_GEMINI_API_KEY` in `.env`.
   - **Offline/Local Knowledge Base**: Automatic graceful fallback if network is patchy or key is not yet set.
   - **Web Speech API**: Live speech-to-text input + natural text-to-speech voice playback in all three languages.

4. **13 Production Pages & Full State Handling**:
   - Onboarding (language choice, civic purpose, zero-login).
   - Home / Check (Scan, Listing Link, Licence number, Mandatory QCO categories strip).
   - Capture Guide (viewfinder, glare reduction, 4-photo multi-shot, quality meter).
   - Listing Link Input (Amazon, Flipkart, JioMart, Meesho parser with preview).
   - Manual Licence Input (7-digit CM/L and R-number formatting helper).
   - Analysis Pipeline (5-step honest progress tracker).
   - Result Summary (4 exact banners, SCOPE-4 strip, disclaimer).
   - Claim Detail (OCR bounding boxes, confidence score, inline digit editor).
   - Record Comparison (Side-by-side table: Product vs Official).
   - Timeline Check (Licence validity vs batch date).
   - Evidence Trail (Preserved files with SHA-256 hashes and integrity notice).
   - EcoLoop (BEE Energy star verification, Coimbatore collection points map & list).
   - Report to BIS (BIS Care grievance layout, consent toggle, JSON export).
   - My Checks & Tracker (8 history checks, 3 reports across review stages, reviewer notes).
   - Learn & Methodology (ISI, CRS, Hallmark, QCO lookup, known blind spots).
   - Profile & Accessibility (Text scaling up to 175%, High Contrast, JSON data export).

---

## 🛠️ Tech Stack

- **Database**: SQLite 3 (`bis_sentinel.db`)
- **Framework**: React 18 (JSX) + Vite
- **Styling**: Tailwind CSS + Custom Design Tokens (Indigo, Warm off-white, Teal, Amber, Slate, Rose)
- **Typography**: Google Noto Sans, Noto Sans Tamil, Noto Sans Devanagari
- **Routing**: React Router v6
- **State**: Zustand
- **Async**: TanStack Query (React Query)
- **i18n**: react-i18next with full translations in `en`, `ta`, and `hi`
- **Icons**: Lucide React
- **PWA**: `vite-plugin-pwa` with Service Worker & Web App Manifest
- **AI & Voice**: Google Gemini 1.5 Flash API + Web Speech API (STT & TTS)

---

## 🚀 Quick Start Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Gemini API Key (Optional)
Open `.env` in the project root:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
*(If left blank, Sentinel Sahayak automatically uses its built-in multilingual civic knowledge base)*

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`. The SQLite API and frontend run together on the same port.

### 4. Build for Production
```bash
npm run build
npm run preview
```

---

## ⚖️ Civic Design & Non-Alarmist Copy Guidelines

- **Never** uses words like "fake", "fraud", "genuine", or "counterfeit".
- **Never** displays aggressive red-and-skull imagery.
- Uses **"No mismatch detected in the available evidence"**, **"Possible inconsistency requiring review"**, and **"Unable to verify with available records"**.
- Always includes the persistent civic disclaimer:
  > *"This is a check against available records, not a legal finding."*
