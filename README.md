
# Global Economy (Economy Explorer)

Global economic data and AI-powered insights — an interactive web dashboard that imports World Bank GDP and population data into PostgreSQL and serves stored data to the UI.

## Features

- Real-time World Bank data ingestion
  - Backend endpoint to fetch and persist World Bank GDP and population data (POST /api/economy/store).
  - Cleans and normalizes World Bank responses (filters nulls, parses years, rounds values).

- REST API
  - Public endpoint to retrieve structured economy data (GET /api/economy), supports region filtering (e.g., `?region=asia`).
  - API returns metadata (source, indicator, lastUpdated) and structured records ready for the frontend.

- Data storage & analytics
  - Persists country GDP records to a PostgreSQL database using a DB pool.
  - Calculates continent summaries (total GDP, average GDP, country counts, top country) for the latest year.

- Interactive Dashboard (Frontend)
  - Region selector (Global, Asia, Europe, Americas, Africa, Oceania), country search, and a countries data table.
  - Key metric cards (Top GDP, Total Countries, Latest Year, Data Points) and Top Economies list.
  - AI Insights panel providing high-level trend observations.
  - Smooth animations and responsive UI.

- UX / UI
  - Built with Tailwind CSS and Framer Motion for animations.
  - Sidebar, hero, footer, and subscription CTA with social links.

## Tech stack

- Frontend: React + TypeScript (.tsx), Tailwind CSS, Framer Motion
- Backend: Express.js, Axios
- Data: PostgreSQL, refreshed on demand from the World Bank API

## Quick start (inferred)

1. Clone the repo:
   git clone https://github.com/Daniel-1600/Global-economy.git

2. Install dependencies:
   - Root or client:
     npm install
   - Server (if separated under SERVER/):
     cd SERVER
     npm install

3. Configure environment:
   - Create a .env (or configure environment vars) for PostgreSQL connection string and any other server envs. The server code references a DB pool in SERVER/config/db.js — set DATABASE_URL or the variables used there.
   - Apply the SQL files in `SERVER/migrations` in numeric order.

4. Run the server:
   - Example (adjust to your scripts):
     cd SERVER
     npm run dev   # or npm start

5. Run the frontend:
   - In project root:
     npm run dev   # or the specific script for the frontend

6. Open the app:
   - Visit http://localhost:3000 (or the port your frontend uses) and navigate to /dashboard to view the Economy Dashboard.

## API notes (inferred)

- POST /api/economy/store
  - Fetches GDP and population data from the World Bank API and stores cleaned records in the database. This is the only refresh operation used by the country data explorer.

- POST /api/collect
  - Returns stored GDP and population history for one three-letter country code; it does not call the World Bank API.

## Daily data refresh

`SERVER/scripts/refresh-economy.sh` calls the refresh endpoint, prevents overlapping
imports, fails on HTTP errors, and allows up to 30 minutes for an import. A typical
Fedora cron entry that runs it every day at 02:00 Africa/Nairobi time is:

```cron
CRON_TZ=Africa/Nairobi
0 2 * * * /home/blews/projects/Global-economy/SERVER/scripts/refresh-economy.sh >> /home/blews/projects/Global-economy/SERVER/logs/economy-refresh.log 2>&1
```

The backend must be running on port 5000 at the scheduled time. Override the URL
with `ECONOMY_REFRESH_URL` if it is hosted elsewhere.

- GET /api/economy
  - Returns structured data and metadata. Supports query param `region` (e.g., `?region=asia`) to filter by continent/region.

- GET /api/economy?table=<table>&limit=<n>
  - Backend includes routes for fetching stored results from DB tables (e.g., gdp table, continent_summaries) with ordering and limits.

## Development notes

- Frontend fetches API at `http://localhost:5000/api/economy` in the dashboard code; ensure the server runs on port 5000 or update the frontend fetch URL.
- The app infers continent groupings and computes continent summaries for the latest year in the dataset.
- Some placeholder UI elements (AI insights text, hero CTA, subscription form) are present and may be wired to backend/email services in the future.

