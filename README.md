# Shopping List App (HW-3)

Jednoduchá webová aplikace pro správu sdílených nákupních seznamů. Tato práce odpovídá zadání HW‑3: přehled (dashboard) pro vlastníka i pozvaného uživatele, detail seznamu se správou členů a položek, základní archivace, stavy pending/error/ready při načítání dat.

## Stack
- React 18
- Vite (dev/build)
- CSS (globální reset v `src/index.css`, layout v `src/App.css`)

## Struktura a routy
- `src/routes`
  - `/owner_dashboard` (a `/`) – přehled všech seznamů, kde jsem vlastník; přepínání aktivní/archiv, mock vytvoření, otevření detailu.
  - `/member_dashboard` – přehled seznamů, kam jsem pozvaný.
  - `/owner_list/:listId` – detail seznamu pro vlastníka.
  - `/member_list/:listId` – detail seznamu pro člena.
- `src/routes/components` – sdílené UI (editable header, správa členů, seznam položek, toolbar).
- `src/data.js` – mockovaná startovní data.
- `src/services/listService.js` – mock „server“ s asynchronním načítáním.

## Lokální spuštění
```bash
npm install
npm run dev   # http://localhost:5173
```

## Build
```bash
npm run build
```
Výstup je v `dist` (pro náhled `npm run preview`).

## Vlastnosti
- Dashboard vlastníka: vytvořit mock seznam, archivace/obnovení, mazání s potvrzením, otevření detailu; zvláštní sekce pro seznamy, kde jsem pozvaný.
- Detail seznamu: přejmenování, správa členů (přidat/odebrat/odejít), položky (přidat/mazat/editovat, filtrovat nevyřešené), „share“ akce jako alerty.
- Pending/error/ready stavy při načítání dashboardu i detailů (mock API).

## Mock/real API přepínač
- Mock je zapnutý ve výchozím stavu (`VITE_USE_MOCK=true`).
- Pro vypnutí mocku a použití reálného API (zatím neimplementováno) nastav `VITE_USE_MOCK=false` v `.env` nebo prostředí. Při vypnutém mocku služby zatím vyhodí chybu, aby bylo zřejmé, že backend není připraven. 
