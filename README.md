# Shopping List App (HW-5)

Shared shopping list app built with React. This HW4 version builds on HW3 and adds
charts (Recharts), UI theming, and simple localization.

## New in HW5
- Dashboard list overview chart (item counts per list).
- Detail view pie chart (resolved vs unresolved items).
- Light/Dark theme toggle.
- CZ/EN UI language toggle (data stays unchanged).
- Responsive layout for list/detail views.

## Structure
- `src/backend/server.js` - HTTP mock backend (POST `/api/*`).
- `src/backend/mock` - datastore and handlers for lists, members, owners.
- `src/services/listService.js` - frontend services calling the backend.
- `src/routes/*` - dashboard and detail routes (owner/member).
- `src/routes/components/*` - shared UI components (members, items, charts, toolbar).
- `src/context/PreferencesContext.jsx` - theme + language state.
- `src/i18n/translations.js` - UI strings for CZ/EN.

## Run
1) Install dependencies
```bash
npm install
```

2) Mock backend (port 4000)
```bash
npm run backend
```

3) Frontend (Vite dev server on 5173)
```bash
npm run dev
```

Open `http://localhost:5173/owner_dashboard`. The member dashboard is at
`/member_dashboard`.

## Configuration
- Backend URL: `VITE_API_URL` (default `http://localhost:4000/api`).
- The mock server is the only backend used by the app.

## Quick guide
- Owner: creates lists, archives/restores, deletes, manages members/items.
- Member: can manage items and leave a list from the detail view.
