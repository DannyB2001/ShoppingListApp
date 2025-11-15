# Shopping List App

Jednoduchá single-page aplikace pro správu sdílených nákupních seznamů. Verze ukol-2.
## Stack
- [React 18](https://react.dev/)
- [Vite](https://vitejs.dev/) pro vývoj/build pipeline
- Vanilla CSS (globální reset v `src/index.css`, layout v `src/App.css`)

## Struktura aplikace
- `src/routes` – jednotlivé routy (pohled vlastníka seznamu, člena, detailní pohledy)
- `src/routes/components` – sdílené komponenty (editable header, správa členů, seznam položek)
- `src/data.js` – mocked data pro lokální testování

## Lokální spuštění
```bash
npm install
npm run dev    # vývojový server na http://localhost:5173
```

## Build
```bash
npm run build
```
Artefakty se uloží do `dist`. V produkci je lze servírovat libovolným statickým serverem (např. `npm run preview` nebo `serve dist`).

## Vlastnosti
- Přehled všech seznamů, které vlastníte nebo kde jste členem
- Detail nákupního seznamu (správa členů, položek, filtrování, inline editace)
- Mockované akce jako přejmenování, archivace, přidání člena/položky – ve skutečné aplikaci je stačí navázat na backend/API

