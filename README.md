# Telemetry Dashboard

A full-stack web application for visualizing and analyzing U.S. power grid and electricity sales data. The dashboard allows users to filter by state, sector, and time range, and displays results in interactive charts and tables.

## Features
- Fetches real electricity sales and price data from the EIA API
- Filter by state, sector, start/end date, and result length
- Visualizes data with interactive charts (Recharts) and tables (Material-UI)
- Modern React + TypeScript frontend (Vite)
- Node.js + TypeScript backend API

---

## Getting Started

### Prerequisites
- Node.js v20.19.0 or newer (required for Vite 7+)
- npm (comes with Node.js)
- Register with EIA to obtain an API Key [here](https://www.eia.gov/opendata/register.php)

### 1. Clone the repository
```sh
git clone <your-repo-url>
cd telemetry-dashboard
```

### 2. Set up the backend (API server)
```sh
cd server
npm install
```

- Copy `.env.example` to `.env` and add your EIA API key:
  ```sh
  cp .env.example .env
  # Edit .env and set EIA_API_KEY=your_key_here
  ```
- Start the backend server:
  ```sh
  npm run dev
  # The API will run on http://localhost:4000
  ```

### 3. Set up the frontend (React client)
```sh
cd ../client
npm install
npm run dev
# The app will run on http://localhost:5173
```

### 4. Using the App
- Open [http://localhost:5173](http://localhost:5173) in your browser.
- Use the filter bar to select state, sector, and date range.
- Click "Fetch Data" to view results in charts and tables.

---

## Project Structure
```
telemetry-dashboard/
  server/    # Node.js + TypeScript backend API
  client/    # React + TypeScript frontend (Vite)
```

---

## API Reference
- The backend exposes `/api/telemetry` for filtered data.
- See `server/src/index.ts` for details.

---

## License
MIT 