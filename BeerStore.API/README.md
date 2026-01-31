# Beer Store API

ASP.NET Core Web API for the Beer Store application.

## Prerequisites

- .NET 8.0 SDK or later
- SQL Server (LocalDB, Express, or Full)
- Visual Studio 2022 or Visual Studio Code

## Getting Started

### 1. Restore NuGet Packages

```bash
dotnet restore
```

### 2. Update Database Connection String

Edit `appsettings.json` and update the connection string if needed:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=BeerStoreDb;Trusted_Connection=true;MultipleActiveResultSets=true"
}
```

### 3. Create Database and Apply Migrations

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 4. Run the Application

```bash
dotnet run
```

The API will be available at:
- HTTPS: `https://localhost:5001`
- HTTP: `http://localhost:5000`
- Swagger UI: `https://localhost:5001/swagger`

## Project Structure

```
BeerStore.API/
├── Controllers/          # API Controllers
├── Models/
│   ├── Entities/        # Database entities
│   └── DTOs/            # Data Transfer Objects
├── Services/
│   ├── Interfaces/      # Service interfaces
│   └── Implementations/ # Service implementations
├── Repositories/
│   ├── Interfaces/      # Repository interfaces
│   └── Implementations/ # Repository implementations
├── Data/                # DbContext and migrations
├── Middleware/          # Custom middleware
├── Utilities/           # Helper classes
└── Configuration/       # Configuration classes
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Beers
- `GET /api/beers` - Get all beers with filters
- `GET /api/beers/{id}` - Get beer by ID
- `GET /api/beers/styles` - Get available styles
- `GET /api/beers/brands` - Get available brands
- `GET /api/beers/best-sellers` - Get best sellers
- `GET /api/beers/search?q={query}` - Search beers

### Cart (Requires Authentication)
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/{id}` - Update cart item
- `DELETE /api/cart/items/{id}` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID

## Database

The database is seeded with sample data on first run, including:
- 16 German beers
- Multiple categories (main and style categories)
- Beer-category relationships

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected endpoints:

1. Register or login to get a token
2. Include the token in the Authorization header: `Bearer {token}`

## CORS Configuration

CORS is configured to allow requests from Angular frontend running on:
- `http://localhost:4200`
- `http://localhost:4201`

Update `appsettings.json` to add more allowed origins if needed.

## Development

### Adding New Migrations

```bash
dotnet ef migrations add MigrationName
dotnet ef database update
```

### Removing Last Migration

```bash
dotnet ef migrations remove
```

### Testing with Swagger

Navigate to `https://localhost:5001/swagger` to test the API endpoints interactively.

## Production Deployment

1. Update `appsettings.Production.json` with production settings
2. Change JWT SecretKey to a strong, unique value
3. Update CORS allowed origins
4. Set `RequireHttpsMetadata = true` in JWT configuration
5. Use a production SQL Server instance
6. Enable proper logging and monitoring

## Technologies Used

- ASP.NET Core 8.0
- Entity Framework Core 8.0
- SQL Server
- JWT Authentication
- BCrypt for password hashing
- Swagger/OpenAPI for documentation
- AutoMapper (ready for use)
- FluentValidation (ready for use)
