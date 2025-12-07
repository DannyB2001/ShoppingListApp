# Shopping List App (HW-4)

Domácí úkol pro správu sdílených nákupních seznamů. Navazuje na HW3, ale přidává mock backend server, perzistenci operací a lokalizovaná data (čeština).

## Co přibylo oproti HW3
- Mock backend server (`npm run backend`) s perzistencí v paměti a asynchronními handlery.
- Všechna CRUD volání jdou přes backend (žádný localStorage fallback).
- Lokalizovaná mock data: čeští uživatelé, položky, chybové hlášky.
- Přidán seznam „Oslava“ s uživatelem Daniel jako pozvaným a Anežkou jako vlastníkem.
- Rejoin workflow: lze opustit seznam a znovu se připojit přes backend.
- Lepší obsluha chyb v detailech členů (zobrazují se hlášky).

## Struktura
- `src/backend/server.js` – HTTP mock backend (POST `/api/*`).
- `src/backend/mock` – datastore a handlery pro seznamy, členy, vlastníky.
- `src/services/listService.js` – frontend služby volající backend.
- `src/routes/*` – stránky dashboardu a detailů (owner/member).
- `src/routes/components/*` – UI komponenty detailu (členové, položky, hlavička).

## Spuštění
1) Instalace závislostí
```bash
npm install
```

2) Mock backend (port 4000)
```bash
npm run backend
```

3) Frontend (Vite dev server na 5173)
```bash
npm run dev
```

Otevři `http://localhost:5173/owner_dashboard` (root `/` přesměruje sem). Přehled pozvaných je na `/member_dashboard`.

## Konfigurace
- Backend URL: `VITE_API_URL` (výchozí `http://localhost:4000/api`).
- Mock server je jediný backend (real API není potřeba).

## Krátký průvodce
- Vlastník: vytváří seznamy, archivuje/obnovuje, maže, spravuje členy/položky.
- Člen: v detailu seznamu může přidávat/řídit položky a odejít ze seznamu; tlačítko „Znovu připojit“ se ukáže v přehledu jen po odchodu.
