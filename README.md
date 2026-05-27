# Tankstellen Köln

Eine Single-Page-Applikation zur Darstellung aller Tankstellen im Kölner Stadtgebiet. Die Daten stammen von der [Offene Daten Köln](https://offenedaten-koeln.de/dataset/tankstellen-koeln) Plattform und werden über eine ArcGIS REST API einmalig geladen.

## Features

- **Tabellenansicht** mit Straße, PLZ/Stadtteil
- **Kartenansicht** mit Leaflet + OpenStreetMap (Marker mit Popup)
- **Echtzeit-Suche** nach Straßennamen (case-insensitive)
- **Sortierung** alphabetisch aufsteigend / absteigend / unsortiert
- **Responsive Design** für Desktop und Mobilgeräte
- **Loading- & Error-States** für robuste UX

## Tech-Stack

| Bereich    | Technologie                          |
| ---------- | ------------------------------------ |
| Framework  | Vue 3 + Composition API + TypeScript |
| Build-Tool | Vite                                 |
| Styling    | Tailwind CSS 4                       |
| Karte      | Leaflet + vue-leaflet                |
| Testing    | Vitest + Vue Test Utils              |
| Linting    | ESLint (Flat Config) + Prettier      |
| Git Hooks  | Husky + lint-staged                  |
| CI/CD      | GitHub Actions                       |

## Schnellstart

```bash
# Repository klonen
git clone https://github.com/<username>/tankstellen-koeln.git
cd tankstellen-koeln

# Dependencies installieren
npm install

# Dev-Server starten
npm run dev

# Tests ausführen
npm test

# Produktions-Build erstellen
npm run build
```

## Verfügbare Scripts

| Script               | Beschreibung                         |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Startet den Vite Dev-Server          |
| `npm run build`      | TypeScript Check + Produktions-Build |
| `npm run preview`    | Vorschau des Produktions-Builds      |
| `npm run lint`       | ESLint prüfen                        |
| `npm run lint:fix`   | ESLint prüfen und automatisch fixen  |
| `npm run format`     | Prettier Formatierung anwenden       |
| `npm test`           | Unit-Tests einmalig ausführen        |
| `npm run test:watch` | Unit-Tests im Watch-Modus            |

## Projektstruktur

```
src/
├── api/
│   └── tankstellen/
│       ├── tankstellen.api.ts        # API-Service (fetchTankstellen)
│       ├── tankstellen.api.test.ts   # Unit-Tests API-Service
│       └── tankstellen.types.ts      # TypeScript-Typen (Tankstelle, ArcGIS-Response)
├── components/
│   ├── SearchBar/
│   │   ├── SearchBar.vue             # Suchfeld mit v-model
│   │   └── SearchBar.test.ts
│   ├── SortControls/
│   │   ├── SortControls.vue          # Sortier-Button (asc/desc/none)
│   │   └── SortControls.test.ts
│   ├── TankstellenTable/
│   │   ├── TankstellenTable.vue      # Tabelle mit geparsten Adressdaten
│   │   └── TankstellenTable.test.ts
│   └── TankstellenMap/
│       ├── TankstellenMap.vue        # Leaflet-Kartenansicht
│       └── TankstellenMap.test.ts
├── stores/
│   └── tankstellen/
│       ├── tankstellen.store.ts      # Pinia-Store: Laden, Filtern, Sortieren
│       └── tankstellen.store.test.ts
├── utils/
│   └── address/
│       ├── address.ts                # Adress-Parsing (Straße, PLZ, Stadtteil)
│       └── address.test.ts
├── assets/                            # Statische Assets
├── App.vue                            # Hauptlayout
├── main.ts                            # Entry Point (Vue + Pinia Setup)
├── env.d.ts                           # Vite/Vue Type-Definitionen
└── style.css                          # Tailwind-Imports + Basis-Styles
```

## Kollaboratives Entwickeln & Code-Qualität

Die folgenden Maßnahmen stellen eine hohe Code-Qualität und reibungslose Zusammenarbeit sicher:

### Automatisierte Qualitätssicherung

- **ESLint** mit Flat Config (Vue + TypeScript Regeln) erkennt Code-Probleme statisch
- **Prettier** sorgt für einheitliche Formatierung im gesamten Projekt
- **Husky + lint-staged** führen bei jedem Commit automatisch ESLint und Prettier auf geänderten Dateien aus
- **TypeScript** im Strict Mode verhindert Typfehler zur Compile-Zeit
- **VSCode Extensions** Öffnet popup mit Empfehlungen für extensions die im Projekt verwendet werden sollten

### CI/CD Pipeline

Die GitHub Actions Pipeline (`ci.yml`) führt bei jedem Push und Pull Request automatisch aus:

1. ESLint Check
2. Prettier Check
3. TypeScript Type-Check
4. Unit Tests
5. Produktions-Build

### Weitere Empfehlungen

- **Conventional Commits** (`feat:`, `fix:`, `refactor:`, etc.) für aussagekräftige Git-Historie
- **Branch Protection Rules** auf `main` (Reviews + CI muss grün sein)
- **Pull Request Templates** für strukturierte Code-Reviews
- **Semantic Versioning** für nachvollziehbare Releases

---

## CRUD-Architektur-Konzept

Die bestehende ArcGIS REST API ist eine reine Lese-Schnittstelle (Read-Only). Um daraus eine vollwertige CRUD-Schnittstelle (Create, Read, Update, Delete) zu machen, würde man eine eigene Backend-API davor setzen.

### Vorgeschlagene Architektur

```
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────────┐
│   Vue 3 SPA     │────▶│  REST API        │────▶│  PostgreSQL +        │
│   (Frontend)    │◀────│  (NestJS)        │◀────│  PostGIS             │
│                 │     │                  │     │  (Datenbank)         │
└─────────────────┘     └──────────────────┘     └──────────────────────┘
                               │
                               ▼
                        ┌──────────────┐
                        │ Initial-Sync │
                        │ ArcGIS → DB  │
                        └──────────────┘
```

### Tech-Stack Vorschlag

| Schicht         | Technologie               | Begründung                                       |
| --------------- | ------------------------- | ------------------------------------------------ |
| **Frontend**    | Vue 3 + TypeScript + Vite | Bereits vorhanden, erweitern um CRUD-Formulare   |
| **Backend**     | NestJS (Node.js)          | TypeScript-native, modulare Architektur, OpenAPI |
| **ORM**         | TypeORM oder Prisma       | Type-safe Database-Zugriff, Migrations           |
| **Datenbank**   | PostgreSQL + PostGIS      | Geodaten-Support, räumliche Abfragen             |
| **Validierung** | class-validator / Zod     | Request-Validierung auf API-Ebene                |
| **Auth**        | JWT                       | Absicherung der schreibenden Endpoints           |
| **Docs**        | Swagger / OpenAPI         | Auto-generierte API-Dokumentation                |

### API-Endpunkte

```
POST   /api/tankstellen           # Neue Tankstelle anlegen
GET    /api/tankstellen           # Alle Tankstellen (mit Filter & Pagination)
GET    /api/tankstellen/:id       # Einzelne Tankstelle
PUT    /api/tankstellen/:id       # Tankstelle aktualisieren
DELETE /api/tankstellen/:id       # Tankstelle löschen
```

### Datenbank-Schema

Auf dritte normalform bringen. ist im jetztigen stand von ArcGIS im JSON format nicht der fall.

```sql
CREATE TABLE tankstellen (
  id           SERIAL PRIMARY KEY,
  adresse      VARCHAR(200) NOT NULL,
  strasse      VARCHAR(150),
  plz          VARCHAR(5),
  stadtteil    VARCHAR(100),
  location     GEOGRAPHY(POINT, 4326) NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW() -- timestamp mit timezone
);

CREATE INDEX idx_tankstellen_location ON tankstellen USING GIST(location);
CREATE INDEX idx_tankstellen_strasse ON tankstellen(strasse);
```

### Initial-Sync

Beim ersten Start des Backends werden die bestehenden Daten einmalig aus der ArcGIS API geladen und in die eigene PostgreSQL-Datenbank überführt. Danach dient die eigene API als Single Source of Truth.

---

## Hosting-Konzept

### Option 1: Managed Services (empfohlen für schnellen Start)

**Vorteile:** Kein Server-Management, automatische Deployments via GitHub, eingebautes SSL, globales CDN für das Frontend.

### Option 2: Self-Hosted mit Docker Compose

Deployment auf einem VPS (Hetzner, DigitalOcean) mit Reverse-Proxy (Caddy oder nginx) und Let's Encrypt SSL.

**Vorteile:** Volle Kontrolle, geringere laufende Kosten bei höherer Last, Daten bleiben in Deutschland (DSGVO).

### Option 3: Nur Frontend (aktueller Stand)

Da die App aktuell nur ein Frontend ohne eigenes Backend ist, reicht ein statisches Hosting:

- **GitHub Pages** (kostenlos, direkt aus dem Repository)
- **Vercel / Netlify** (kostenlos, automatische Deployments bei Push)
