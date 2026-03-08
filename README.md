# Sandero Hub

Sandero Hub is a reduced-scope **React + Vite** MVP for a Replit-ready personal AI workspace.

This version is intentionally small:

- exactly **4 tabs**: Chat, Tasks, Projects, Memory
- exactly **3 exposed actions/concepts**: `summarize`, `create_task`, `draft_message`
- lightweight **mock behavior only** so the UI is easy to demo and iterate on

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
- Mock chat responses that point users back to the three supported actions
- Mock task creation that adds items to the Tasks tab
- Mock message drafting shown in the Projects tab
- Static memory notes to show the future shape of memory context
- Responsive dark theme

## Explicitly deferred for now

These are **not implemented yet** in this MVP:

- agenda
- mail
- document analysis
- proactive suggestions
- day start / day end flows
- personal dashboards

## Tech stack

- React 19
- Vite 7
- Plain CSS

## Run locally

From the `sandero-hub` folder:

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal.

## Production build

```bash
npm run build
npm run preview
```

## Replit notes

This project stays Replit-friendly:

- no backend required
- no environment variables required
- no external services required
- mock/demo data lives in `src/App.jsx`
- includes a `.replit` file so Replit can boot it more easily

### Import into Replit

1. Create a new Repl from GitHub or upload this project folder.
2. Wait for Replit to install dependencies.
3. If it does not auto-run, use:

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 3000
```

4. Open the Replit web preview.

## Current product intent

The goal of this version is to show the simplified shape of Sandero Hub before adding real integrations or broader workflows. It should be easy to understand in a quick demo: users can switch between four tabs and try exactly three actions.
