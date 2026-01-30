<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Global Mobility Cost Estimator - Frontend

This is the frontend application for the Global Mobility Cost Estimator, integrated with the Django REST Framework backend API.

## Features

- **Single Estimate Calculation**: Calculate costs for individual international deployments
- **Batch Processing**: Upload CSV/XLSX files for bulk cost estimation
- **Real-time API Integration**: Uses TanStack Query and Axios for API calls
- **Authentication**: Token-based authentication with Bearer tokens

## Prerequisites

- Node.js (v18 or higher recommended)
- Backend API running on `http://localhost:8000`

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Install required packages (if not already installed):
   ```bash
   npm install @tanstack/react-query axios
   ```

## Running the Application

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open your browser to the URL shown in the terminal (typically `http://localhost:5173`)

3. **Set Authentication Token**:
   - When you first open the app, you'll see an authentication token input at the top
   - Enter your Bearer token to authenticate API requests
   - The token is stored in localStorage and persists across page refreshes

## API Integration

The frontend is fully integrated with the backend API endpoints:

- **GET /api/v1/config**: Fetches available countries and durations
- **POST /api/v1/estimate/calculate**: Calculates single estimate
- **POST /api/v1/estimate/batch**: Uploads batch file for processing
- **GET /api/v1/estimate/batch/:job_id**: Polls batch job status

### API Configuration

The API base URL is configured in `services/api.ts`. To change it, update:

```typescript
const API_BASE_URL = "http://localhost:8000/api/v1";
```

## Project Structure

```
cost-estimate-fe/
├── components/          # React components
│   ├── AuthTokenInput.tsx
│   ├── BatchProcessView.tsx
│   ├── CostEstimatorForm.tsx
│   └── EstimateResultsView.tsx
├── contexts/           # React contexts
│   └── AuthContext.tsx
├── hooks/              # Custom React hooks
│   └── useEstimatorQueries.ts
├── services/           # API service layer
│   ├── api.ts
│   └── estimatorApi.ts
├── types.ts            # TypeScript type definitions
└── App.tsx             # Main application component
```

## Technologies Used

- **React 19**: UI framework
- **TypeScript**: Type safety
- **TanStack Query**: Data fetching and caching
- **Axios**: HTTP client
- **Tailwind CSS**: Styling
- **React Select**: Dropdown components
- **Recharts**: Data visualization

## Development

The app uses Vite as the build tool. For production builds:

```bash
npm run build
npm run preview
```
