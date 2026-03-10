# Sandero Hub

Sandero Hub is a reduced-scope **React + Vite** MVP for a Replit-ready personal AI workspace.

This version is intentionally small, but now includes a thin backend layer:

- exactly **4 tabs**: Chat, Tasks, Projects, Memory
- exactly **3 exposed UI actions/concepts**: `summarize`, `create_task`, `draft_message`
- a small **Twin API** backend that can:
  - receive app input
  - retrieve lightweight context
  - call OpenClaw
  - trigger n8n webhooks
  - return results to the UI

## What this MVP includes

- A single-page app with four tab surfaces:
  - Chat
  - Tasks
  - Projects
  - Memory
- Action demo panels for:
  - `summarize`
  - `create_task`
  - `draft_message`
- A **Twin API** demo panel in the UI
- An Express backend in `server/index.js`
- `/api/health` for backend status
- `/api/context` for lightweight context retrieval
- `/api/twin/query` for the main Twin API flow
- `/api/n8n/trigger` for direct n8n webhook triggering
- Mock fallback behavior when OpenClaw or n8n are not configured yet
- Responsive dark theme

## Explicitly deferred for now

These are **not implemented yet** in this MVP:

- agenda
- mail
- document analysis
- proactive suggestions
- day start / day end flows
- personal dashboards
- production auth / tenant isolation
- real persistence beyond in-memory demo behavior

## Tech stack

- React 19
- Vite 7
- Express 5
- Plain CSS

## Environment variables

Copy `.env.example` if you want to wire live integrations:

```bash
PORT=8787
OPENCLAW_API_URL=
OPENCLAW_API_KEY=
N8N_WEBHOOK_URL=
```

Notes:

- If `OPENCLAW_API_URL` is empty, the backend returns a clean fallback response.
- If `N8N_WEBHOOK_URL` is empty, webhook calls are skipped gracefully.

## Run locally

From the `sandero-hub` folder:

```bash
npm install
npm run dev
```

That starts:

- the Express Twin API on port `8787`
- the Vite UI on port `3000`

The Vite dev server proxies `/api/*` to the backend.

## Production build

```bash
npm run build
npm run preview
```

## Replit notes

This project stays Replit-friendly:

- one Replit run command starts both frontend and backend
- backend listens internally on port `8787`
- frontend serves on port `3000`
- `.replit` is configured to run `npm install && npm run start`

### Import into Replit

1. Create a new Repl from GitHub or upload this project folder.
2. Wait for Replit to install dependencies.
3. If it does not auto-run, use:

```bash
npm install
npm run start
```

4. Open the Replit web preview.
5. Optional: add `OPENCLAW_API_URL`, `OPENCLAW_API_KEY`, and `N8N_WEBHOOK_URL` in Replit Secrets.

## API summary

### `GET /api/health`
Returns backend health and config visibility.

### `POST /api/context`
Request body:

```json
{ "input": "Prepare a short summary" }
```

Returns lightweight product/context info.

### `POST /api/twin/query`
Request body:

```json
{
  "input": "Summarize the latest product direction",
  "triggerWorkflow": true
}
```

Flow:

1. receives app input
2. builds context
3. optionally calls OpenClaw
4. optionally triggers n8n
5. returns the combined result to the UI

### `POST /api/n8n/trigger`
Direct webhook trigger endpoint for explicit workflow calls.

## Current product intent

The goal of this version is to show the simplified shape of Sandero Hub while introducing the first real integration layer. It is still easy to demo quickly, but no longer purely frontend-only.
