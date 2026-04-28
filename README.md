# Asset Management API

A clean architecture ASP.NET Core 8 Web API for asset management with dependency injection and Swagger documentation.

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
