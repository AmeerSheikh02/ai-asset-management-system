# Asset Management API - Project Instructions

This is an ASP.NET Core 8 Web API project built with clean architecture principles.

## Project Overview

- **Framework**: ASP.NET Core 8
- **Language**: C#
- **Architecture**: Clean Architecture with Dependency Injection
- **Database**: Entity Framework Core with SQL Server
- **Documentation**: Swagger/OpenAPI

## Project Structure

- `Controllers/` - API endpoints
- `Models/` - Domain entities
- `Services/` - Business logic and interfaces
- `Data/` - Data access layer (DbContext, repositories)
- `DTOs/` - Data Transfer Objects for API contracts
- `Properties/` - Configuration files (launchSettings.json)

## Key Technologies

- Entity Framework Core 8.0
- Swashbuckle.AspNetCore (Swagger)
- Dependency Injection (built-in)
- Async/await patterns

## Running the Project

### Prerequisites
- .NET 8 SDK
- SQL Server LocalDB or modify connection string in `appsettings.json`

### Build
```bash
dotnet build
```

### Run
```bash
dotnet run
```

The application will start on `http://localhost:5000` with Swagger UI available at the root URL.

## Database Setup

1. Update connection string in `appsettings.json` if needed
2. Create migrations: `dotnet ef migrations add InitialCreate`
3. Apply migrations: `dotnet ef database update`

## API Endpoints

All endpoints are prefixed with `/api/assets/`:

- `GET /` - Get all assets
- `GET /{id}` - Get asset by ID
- `POST /` - Create new asset
- `PUT /{id}` - Update asset
- `DELETE /{id}` - Delete asset

## Code Quality

- Follow SOLID principles
- Use dependency injection for all services
- Implement repository pattern for data access
- Use DTOs for API contracts
- Add XML documentation to public members
- Handle async/await properly

## Development Notes

- The project uses null-reference types enabled (`<Nullable>enable</Nullable>`)
- Implicit using statements are enabled for cleaner code
- Swagger is configured to run at the application root in development
