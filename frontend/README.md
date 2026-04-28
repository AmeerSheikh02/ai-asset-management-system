# Asset Management Frontend

A modern React + TypeScript + Vite single-page application for managing organizational assets with full CRUD operations and AI-powered search capabilities.

## ✨ Features

- **Dashboard**: Real-time statistics and quick overview of assets
- **Asset Management**: Full CRUD operations with search and filtering
- **AI-Powered Search**: Natural language queries to find assets
- **Responsive Design**: Works on desktop and tablet devices
- **Type-Safe**: Full TypeScript support throughout
- **Modern Stack**: React 18 with Hooks, Vite for fast builds

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Layout.tsx        # App shell with navigation
│   │   ├── AssetTable.tsx    # Table with sorting & actions
│   │   ├── AssetForm.tsx     # Form with validation
│   │   ├── AIQuery.tsx       # AI search interface
│   │   └── index.ts          # Component exports
│   │
│   ├── pages/               # Page components (routes)
│   │   ├── DashboardPage.tsx # Home dashboard
│   │   ├── AssetsPage.tsx    # Asset inventory
│   │   ├── AIPage.tsx        # AI search page
│   │   ├── NotFoundPage.tsx  # 404 page
│   │   └── index.ts          # Page exports
│   │
│   ├── services/            # API integration
│   │   ├── api.ts           # Axios instance with config
│   │   └── index.ts         # API endpoints (assetsAPI, aiAPI)
│   │
│   ├── hooks/               # Custom React hooks
│   │   └── index.ts         # useAssetSearch, useAssetForm
│   │
│   ├── types/               # TypeScript definitions
│   │   └── index.ts         # AssetDto, DTOs, types
│   │
│   ├── utils/               # Utility functions
│   │   ├── constants.ts     # Statuses, types, colors
│   │   └── helpers.ts       # Format, sort, filter functions
│   │
│   ├── App.tsx              # Routes configuration
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles & design system
│
├── public/                  # Static assets
├── package.json             # Dependencies
├── vite.config.ts           # Build configuration
├── tsconfig.json            # TypeScript configuration
├── .env                     # Environment variables
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (with npm)
- ASP.NET Core 8 backend running on `https://localhost:5001`

### Installation

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| UI Framework | React | 18.3.1 |
| Build Tool | Vite | 6.0.7 |
| Language | TypeScript | 5.7.2 |
| Routing | React Router | 6.28.2 |
| HTTP Client | Axios | 1.7.9 |
| Styling | CSS Variables | - |

## 🎨 Design System

### Colors
- **Primary**: `#1f5eff` (Blue)
- **Success**: `#00ba7c` (Green)  
- **Warning**: `#ffa800` (Orange)
- **Error**: `#b42318` (Red)
- **Text**: `#2c3e50` (Dark)
- **Border**: `rgba(31, 94, 255, 0.16)` (Light Blue)

## 📋 Page Components

### DashboardPage
- Displays key statistics (total assets, total value, maintenance count)
- Shows recently added assets
- Real-time stats calculation

### AssetsPage
- Complete asset inventory with table view
- Search by name, type, or description
- Filter by status (Active, Maintenance, Retired)
- Create, read, update, delete operations
- Inline form for asset creation

### AIPage
- Natural language search interface
- Displays results in formatted table
- Tips for effective queries
- Error handling and empty states

## 🔧 API Integration

### Base URL Configuration
Set `VITE_API_BASE_URL` in `.env`:
```
VITE_API_BASE_URL=https://localhost:5001/api
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)
- [TypeScript Documentation](https://www.typescriptlang.org)
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173` with HMR (Hot Module Replacement) enabled.

### Production Build

```bash
npm run build
```

Output is generated in `dist/` ready for deployment.

### Preview Production Build

```bash
npm run preview
```

## Environment Variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

**Configuration:**

```env
VITE_API_BASE_URL=https://localhost:5001/api
```

This configures the axios client to connect to your ASP.NET Core backend. Update if your API runs on a different URL.

## Features

- ✅ **Functional Components** - Modern React with hooks
- ✅ **Type-Safe** - Full TypeScript coverage
- ✅ **Routing** - React Router v6 for client-side navigation
- ✅ **API Integration** - Axios service layer for API calls
- ✅ **Responsive Design** - Mobile-friendly UI
- ✅ **Build Optimized** - Vite provides fast builds and hot reload

## Key Components

### Layout (`src/components/Layout.tsx`)
Shared app layout with header navigation and route outlets.

### Assets Page (`src/pages/AssetsPage.tsx`)
Demonstrates API integration by fetching and displaying assets from the backend.

### API Service (`src/services/api.ts`)
Axios instance configured to read the API base URL from environment variables.

## API Integration Example

The `AssetsPage` shows how to:
1. Call a service function that uses axios
2. Handle loading and error states
3. Display API data in a table

```tsx
const [assets, setAssets] = useState<AssetDto[]>([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState('')

useEffect(() => {
  getAssets().then(data => setAssets(data)).catch(() => setError('Failed'))
}, [])
```

## CORS Configuration

If you encounter CORS errors, ensure your ASP.NET Core API is configured to allow requests from `http://localhost:5173`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", builder =>
    {
        builder.WithOrigins("http://localhost:5173")
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});
```

## Styling

Global styles are in `src/index.css`. The design system includes:
- CSS variables for colors and spacing (`--primary`, `--surface`, etc.)
- Reusable utility classes (`.button`, `.card`, `.badge`, `.table`, etc.)
- Responsive design with media queries

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint (placeholder)

## Next Steps

1. **Add Authentication**: Implement JWT token handling in axios interceptors
2. **Error Handling**: Create error boundaries and toast notifications
3. **State Management**: Add Zustand or Redux if state grows complex
4. **Testing**: Set up Vitest and React Testing Library
5. **More Pages**: Add asset create/edit/delete pages with forms
6. **API Expansion**: Create more service functions for CRUD operations
