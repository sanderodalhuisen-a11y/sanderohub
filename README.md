# Sandero Hub

Sandero Hub is a first MVP of a dark, dashboard-style AI workspace built with **React + Vite**. It is intentionally powered by **demo/mock data** so the product can be shown, iterated on, and later connected to real integrations.

## Included in this MVP

- Project overview hero and KPI cards
- Sidebar dashboard layout
- Chat window
- Task list
- Memory / profile section
- Activity log
- Settings panel
- Responsive dark theme
- English-only UI copy

## Tech stack

- React 19
- Vite 7
- Plain CSS for a clean, self-contained setup

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

This project is lightweight and Replit-friendly:

- no backend required
- no environment variables required
- no external services required
- mock data is stored directly in `src/App.jsx`

## Suggested next steps

- Replace mock cards and chat data with live sources
- Add routing if each area should become its own page
- Connect Slack, calendar, tasks, and memory backends
- Add authentication and persistent storage
