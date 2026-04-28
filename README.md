# Asset Management System

A full-stack application with an ASP.NET Core 8 Web API backend and a modern React + Vite frontend.

## 🏗️ Project Structure

This is a monorepo with both backend and frontend:

```
Asset Management/
├── /                      # Backend (ASP.NET Core)
│   ├── Controllers/       # API endpoints
│   ├── Models/           # Domain entities
│   ├── Services/         # Business logic
│   ├── Data/             # Data access layer
│   ├── DTOs/             # Data models
│   ├── Program.cs        # Backend entry point
│   └── appsettings.json  # Configuration
│
├── /frontend             # React + Vite frontend
│   ├── src/components/   # Reusable components
│   ├── src/pages/        # Route pages
│   ├── src/services/     # API client
│   ├── package.json      # Dependencies
│   └── vite.config.ts    # Build config
│
└── README.md             # This file
```

## 🛠️ Tech Stack

### Backend
- **ASP.NET Core 8** with C# clean architecture
- **Entity Framework Core** + SQL Server
- **Swagger/OpenAPI** documentation
- **Dependency Injection** for loose coupling

### Frontend
- **React 18** with TypeScript
- **Vite 6** for ultra-fast builds
- **React Router v6** for client routing
- **Axios** for API communication

## 🚀 Quick Start

### Backend Setup

```bash
# Restore and build
dotnet restore
dotnet build

# Setup database
dotnet ef database update

# Run the API
dotnet run
```

API available at `https://localhost:5001` with Swagger UI at root.

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment config
cp .env.example .env

# Start dev server
npm run dev
```

Frontend available at `http://localhost:5173`.

## 📚 API Endpoints

All endpoints use `/api/assets/` prefix:

- `GET /` - Get all assets
- `GET /{id}` - Get asset by ID
- `POST /` - Create asset
- `PUT /{id}` - Update asset
- `DELETE /{id}` - Delete asset

## 🏗️ Architecture

### Backend: Clean Architecture
- Controllers handle HTTP requests
- Services contain business logic
- Repositories abstract data access
- DTOs separate API contracts from domain models
- Dependency Injection wires everything

### Frontend: Component-Based
- Functional components with React Hooks
- TypeScript for type safety
- React Router for navigation
- Axios service layer for API calls
- Responsive CSS design system

## 📦 Key Dependencies

**Backend:**
- Entity Framework Core 8.0
- Swashbuckle.AspNetCore 6.5.0

**Frontend:**
- react 18.3.1
- react-router-dom 6.28.2
- axios 1.7.9
- vite 6.0.7
- typescript 5.7.2

## 🧪 Build & Run

```bash
# Backend build
dotnet build

# Frontend build
cd frontend && npm run build

# Backend run
dotnet run

# Frontend dev
cd frontend && npm run dev
```

## 📝 Database Migrations

```bash
# Create migration
dotnet ef migrations add MigrationName

# Apply migrations
dotnet ef database update

# Revert last migration
dotnet ef migrations remove
```

## 🔐 CORS Configuration

Backend allows frontend on `http://localhost:5173`. Modify in `Program.cs` if needed.

## 📄 Documentation

- **Backend Details**: See `.github/copilot-instructions.md`
- **Frontend Setup**: See `frontend/README.md`
- **API Documentation**: `https://localhost:5001/swagger`

## 🎯 Next Steps

- [ ] Add JWT authentication
- [ ] Implement error handling middleware
- [ ] Create asset CRUD UI pages
- [ ] Add form validation
- [ ] Write unit tests
- [ ] Setup CI/CD pipeline
- [ ] Add logging and monitoring
- [ ] Deploy to cloud

## 📞 Development

For full documentation:
1. Check `frontend/README.md` for frontend specifics
2. Review `.github/copilot-instructions.md` for backend guidelines
3. See `package.json` and `AssetManagementAPI.csproj` for dependencies

## Project Structure

```
AssetManagementAPI/
├── Controllers/          # API endpoints
├── Models/              # Domain entities
├── Services/            # Business logic and service interfaces
├── Data/                # Data access layer (DbContext, repositories)
├── DTOs/                # Data Transfer Objects for API contracts
├── Properties/          # Configuration files
├── Program.cs           # Application entry point and DI configuration
├── appsettings.json     # Configuration settings
└── appsettings.Development.json  # Development-specific settings
```

## Architecture Principles

- **Clean Architecture**: Separation of concerns with clear layer boundaries
- **Dependency Injection**: Built-in DI container for loose coupling
- **Repository Pattern**: Data access abstraction
- **Service Layer**: Business logic separation
- **DTOs**: Request/response models for API contracts

## Getting Started

### Prerequisites

- .NET 8 SDK
- Visual Studio 2022 or VS Code
- SQL Server LocalDB (or modify connection string for another database)

### Installation

1. Restore NuGet packages:
```bash
dotnet restore
```

2. Update the database connection string in `appsettings.json` if needed

3. Create database and run migrations:
```bash
dotnet ef database update
```

4. Run the application:
```bash
dotnet run
```

The API will be available at `http://localhost:5000` and Swagger UI at `http://localhost:5000/swagger`

## API Endpoints

### Assets Controller

- `GET /api/assets` - Get all assets
- `GET /api/assets/{id}` - Get asset by ID
- `POST /api/assets` - Create new asset
- `PUT /api/assets/{id}` - Update asset
- `DELETE /api/assets/{id}` - Delete asset

## API Request Examples

### Create Asset
```json
POST /api/assets
{
	"name": "Laptop",
	"description": "Dell XPS 13",
	"assetType": "Computer",
	"purchasePrice": 1200.00,
	"purchaseDate": "2024-01-15T00:00:00Z",
	"location": "Office A"
}
```

### Update Asset
```json
PUT /api/assets/1
{
	"status": "Maintenance",
	"location": "Warehouse"
}
```

## Dependency Injection Configuration

Services are registered in `Program.cs`:

```csharp
builder.Services.AddScoped<IAssetService, AssetService>();
builder.Services.AddScoped<IAssetRepository, AssetRepository>();
```

## Database

The project uses Entity Framework Core with SQL Server. The database context is configured in `Program.cs`:

```csharp
builder.Services.AddDbContext<ApplicationDbContext>(options =>
		options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
```

## Swagger/OpenAPI

Swagger is enabled by default in development mode. Access the Swagger UI at the application root URL.

## Future Enhancements

- Add authentication and authorization (JWT)
- Implement error handling middleware
- Add unit tests and integration tests
- Add caching strategies
- Implement pagination and filtering
- Add API versioning
- Add logging framework integration

*** End Patch
# ai-asset-management-system
AI-powered asset management backend system built with ASP.NET Core, C#, and SQL, featuring REST APIs, real-time asset tracking, and natural language querying using LLM integration.
