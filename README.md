# Cost and Usage Dashboard

A full-stack web application for visualizing and analyzing U.S. power grid electricity cost and usage data. The dashboard allows users to filter by state, sector, and time range, and displays results in interactive charts and tables.

## Problem Statement

The U.S. energy sector generates vast amounts of telemetry data that is often difficult to access, analyze, and visualize effectively. This is a user-friendly tool to:
- Query electricity sales and pricing data across different states and sectors
- Visualize trends and patterns in energy consumption and costs
- Analyze customer count data for market insights
- Reduce redundant API calls through intelligent caching
- Provide real-time insights into the energy market

## Technical Decisions & Tradeoffs

### Architecture Choices

**Full-Stack Separation**
- ✅ **Pros**: Clear separation of concerns, scalable, maintainable
- ❌ **Tradeoffs**: More complex deployment, requires both frontend and backend

**TypeScript Throughout**
- ✅ **Pros**: Type safety, better IDE support, reduced runtime errors
- ❌ **Tradeoffs**: Additional build complexity

### Technology Stack

**Frontend: React + Vite + Material-UI**
- ✅ **Pros**: Fast development, rich component library, excellent developer experience
- ❌ **Tradeoffs**: Bundle size, React ecosystem complexity

**Backend: Node.js + Express + Redis**
- ✅ **Pros**: JavaScript/TypeScript consistency, excellent Redis integration, fast development
- ❌ **Tradeoffs**: Single-threaded nature, less suitable for CPU-intensive tasks

**Caching: Redis**
- ✅ **Pros**: Fast in-memory storage, persistence, pub/sub capabilities
- ❌ **Tradeoffs**: Additional infrastructure dependency, memory usage

### Data Handling

**EIA API Integration**
- ✅ **Pros**: Official data source, comprehensive coverage, reliable
- ❌ **Tradeoffs**: Rate limits, API key requirements, data format constraints

## Current Features

### Cost and Usage Dashboard
- Fetches real electricity sales and price data from the EIA API
- Filter by state, sector, frequency (monthly/annual), and date range
- Visualizes cost and usage trends with interactive charts (Recharts)
- Displays detailed data tables with sorting and pagination
- Modern React + TypeScript frontend (Vite)

### Customer Dashboard
- Fetches customer count data from the EIA API
- Filter by state, sector, and date range (annual frequency)
- Visualizes customer trends over time
- Displays customer data tables with sorting and pagination
- Separate dashboard for market analysis

### Shared Features
- Node.js + TypeScript backend API with Redis caching
- Responsive Material-UI design with floating containers
- Easy navigation between dashboards
- Real-time data filtering and visualization
- Error handling and loading states

## Next Steps & Future Enhancements
1. **Advanced Filtering**: Implement date range pickers and more granular filtering options
2. **Export Functionality**: Add CSV/JSON export capabilities for data analysis
3. **User Authentication**: Implement user accounts and saved queries
4. **Real-time Updates**: WebSocket integration for live data updates
5. **Advanced Analytics**: Statistical analysis and trend prediction features
6. **Mobile Optimization**: Responsive design improvements for mobile devices
7. **Data Validation**: Enhanced input validation and error handling
8. **Multi-source Integration**: Support for additional energy data sources
9. **Containerization**: Docker support for easier deployment

---

## Getting Started

### Prerequisites
- Node.js v20.19.0 or newer (required for Vite 7+)
- npm (comes with Node.js)
- Register with EIA to obtain an API Key [here](https://www.eia.gov/opendata/register.php)
- Redis server (for caching API responses)

### Redis Setup

The application uses Redis for caching API responses to improve performance and reduce redundant requests to the EIA API.
You can either connect to a local instance or you can spin-up a free hosted instance via a platform of your choice.

#### Redis Configuration

The application connects to Redis using the following environment variables (set in `server/.env`):

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_USERNAME=default
REDIS_PASSWORD=
```

**Default Configuration:**
- Host: `localhost` (Redis server address)
- Port: `6379` (default Redis port)
- Username: `default` (Redis 6+ username, or leave empty for older versions)
- Password: (leave empty for local development, set for production)

**For Production:**
- Set a strong password in `REDIS_PASSWORD`
- Use a dedicated Redis instance or cloud service (AWS ElastiCache, Redis Cloud, etc.)
- Configure proper authentication and network security

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

- Copy `.env.example` to `.env` and add your EIA API key and Redis configuration:
  ```sh
  cp .env.example .env
  # Edit .env and set:
  # EIA_API_KEY=your_key_here
  # REDIS_HOST=localhost
  # REDIS_PORT=6379
  # REDIS_USERNAME=default
  # REDIS_PASSWORD=
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

+#### Frontend Environment Variables
+
+The frontend uses the following environment variable (set in `client/.env` or `client/.env.example`):
+
+```env
+VITE_API_BASE_URL=http://localhost:4000
+```
+
+- **VITE_API_BASE_URL**: The base URL for the backend API. Change this if your backend is running on a different host or port, or if deploying to production.
+

### 4. Using the App
- Open [http://localhost:5173](http://localhost:5173) in your browser.
- **Cost and Usage Dashboard** (default): Analyze electricity costs and consumption data
  - Use the filter bar to select state, sector, frequency (monthly/annual), and date range
  - Click "Fetch Data" to view cost and usage trends in charts and tables
- **Customer Dashboard**: Analyze customer count data
  - Click "Switch to Customer Dashboard" to access customer analytics
  - Filter by state, sector, and date range (annual frequency)
  - View customer trends and market insights
- Navigate between dashboards using the toggle buttons

---

## Project Structure
```
telemetry-dashboard/
  server/    # Node.js + TypeScript backend API with Redis caching
  client/    # React + TypeScript frontend (Vite)
    src/
      App.tsx                    # Main Cost and Usage Dashboard
      CustomerDashboard.tsx      # Customer Dashboard component
      CostAndUsageFilterForm.tsx # Shared filter form component
      CostAndUsageChart.tsx      # Cost and Usage chart component
      CustomerChart.tsx          # Customer chart component
      CostAndUsageDataTable.tsx  # Cost and Usage data table
      CustomerDataTable.tsx      # Customer data table
      options.ts                 # Filter options (states, sectors, frequencies)
```

---

## API Reference
- **`/api/cost-and-usage`**: Fetches cost and usage data with Redis caching
- **`/api/customers`**: Fetches customer count data with Redis caching
- **`/api/grid-topology`**: Parses electric grid topology data (GeoJSON support)
- See `server/src/index.ts` for implementation details

---

## License
MIT