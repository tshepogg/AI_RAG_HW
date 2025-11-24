# Botswana Newspaper AI Search (RAG Demo)

A full-stack Retrieval-Augmented Generation demo that loads Botswana newspaper PDFs from Firebase Storage, builds a local JSON vector store on startup, and exposes a chat-style UI for asking questions across all papers or an individual PDF.

## Project structure
```
server/
  app.js            # Express server + routes
  startup.js        # Startup pipeline: download, parse, chunk, embed, persist
  ragEngine.js      # Retrieval + LLM answering
  pdfLoader.js      # Download PDFs from Firebase Storage
  pdfParser.js      # Extract text via pdf-parse
  chunker.js        # Chunking helper
  embedder.js       # OpenAI embeddings helper
  similarity.js     # Cosine similarity + ranking
  pdfList.json      # List of PDFs to ingest (edit this)
  vectorstore.json  # Generated vector store
  .env.example      # Sample environment vars

client/
  index.html
  vite.config.js
  src/
    main.jsx
    App.jsx
    style.css
    components/
      PdfList.jsx
      PdfViewer.jsx
      ChatBox.jsx
    services/
      api.js
```

## Setup

### 1) Populate `server/pdfList.json`
Add your Firebase Storage file URLs and titles:
```json
[
  { "title": "Mmegi Newspaper (Sample)", "url": "https://firebasestorage.googleapis.com/v0/b/your-bucket/o/mmegi-sample.pdf?alt=media" },
  { "title": "Botswana Daily News (Sample)", "url": "https://firebasestorage.googleapis.com/v0/b/your-bucket/o/botswana-daily-news.pdf?alt=media" }
]
```

### 2) Environment variables
Copy `server/.env.example` to `server/.env` and set your OpenAI key.

```bash
cd server
cp .env.example .env
# edit .env to add OPENAI_API_KEY
```

### 3) Install dependencies
```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 4) Run locally
Open two terminals:
```bash
# Terminal 1 - backend
cd server
npm start

# Terminal 2 - frontend
cd client
npm run dev
```
Frontend runs on http://localhost:5173 and proxies API calls to http://localhost:3000.

## How it works
1. On backend startup, `startup.js` reads `pdfList.json`, downloads each PDF, extracts text via `pdf-parse`, chunks it (~500 chars with overlap), embeds with OpenAI `text-embedding-3-small`, and saves the vector store to `vectorstore.json`.
2. `/pdfs` returns the configured PDFs; `/view/:index` redirects to a PDF URL; `/ask` performs similarity search (cosine) over the JSON vector store (all PDFs or a chosen title) and passes top chunks as context to `gpt-4o-mini` for answers.
3. The React UI lists PDFs, previews the selected PDF, and offers a chat-style question box with scope selector (All vs. specific PDF) and shows sources alongside the AI answer.

## Deployment (Render / Railway / Vercel)

1. **Create two services** or **monorepo deploy**:
   - **Backend**: Deploy `server/` as a Node app. Set `OPENAI_API_KEY`, `PORT` (if required by host), and ensure `pdfList.json` is filled. The server regenerates `vectorstore.json` on each boot.
   - **Frontend**: Deploy `client/` as a static site (Vite build). Configure an environment variable or replace the API base URL in `client/src/services/api.js` with your backend URL for production.

2. **Render**
   - Backend: Start command `npm start`, root `server/`.
   - Frontend: Build command `npm run build`, publish directory `dist`.

3. **Railway**
   - Create two services from the repo: one for `server/` (Node) and one for `client/` (Static). Set `OPENAI_API_KEY` in the backend service. Use a Railway variable (e.g., `VITE_API_BASE`) and point `api.js` to it at build time.

4. **Vercel**
   - Frontend: Deploy `client/` as a Vite project. Add `VITE_API_BASE` env var to point to your backend URL and update `api.js` to read it.
   - Backend: Deploy `server/` as a separate Vercel Node/Serverless function project or host on Render/Railway; update `api.js` accordingly.

## Notes
- Vector store is a JSON file regenerated on every server start. For large PDF sets, consider caching or persisting elsewhere.
- Ensure Firebase Storage URLs are publicly readable or include access tokens.
- Models used: `text-embedding-3-small` for embeddings; `gpt-4o-mini` (or adjust to `o3-mini`) for answers.

## Short LinkedIn blurb
Built a Botswana Newspaper AI RAG demo: Node/Express backend ingests Firebase-hosted PDFs on startup, chunks + embeds them into a JSON vector store, and a Vite/React front-end lets readers browse papers, ask questions across all issues or a single PDF, and see cited sources. Ready for Render/Railway/Vercel deployment with OpenAI + Firebase Storage.
