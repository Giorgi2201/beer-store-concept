# Beer Store API - Setup Instructions

## Quick Start Guide

### Step 1: Install Prerequisites

1. **Install .NET 8.0 SDK**
   - Download from: https://dotnet.microsoft.com/download/dotnet/8.0
   - Verify installation: `dotnet --version`

2. **Install SQL Server** (choose one)
   - SQL Server LocalDB (recommended for development) - comes with Visual Studio
   - SQL Server Express - https://www.microsoft.com/sql-server/sql-server-downloads
   - Full SQL Server

### Step 2: Restore Dependencies

Open a terminal in the `BeerStore.API` folder and run:

```bash
dotnet restore
```

This will download all required NuGet packages.

### Step 3: Update Connection String (if needed)

Open `appsettings.json` and verify the connection string matches your SQL Server setup:

**For LocalDB (default):**
```json
"DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=BeerStoreDb;Trusted_Connection=true;MultipleActiveResultSets=true"
```

**For SQL Server Express:**
```json
"DefaultConnection": "Server=.\\SQLEXPRESS;Database=BeerStoreDb;Trusted_Connection=true;MultipleActiveResultSets=true"
```

**For SQL Server with authentication:**
```json
"DefaultConnection": "Server=YOUR_SERVER;Database=BeerStoreDb;User Id=YOUR_USER;Password=YOUR_PASSWORD;MultipleActiveResultSets=true;TrustServerCertificate=true"
```

### Step 4: Create Database

Run these commands in the terminal:

```bash
# Install EF Core tools (if not already installed)
dotnet tool install --global dotnet-ef

# Create initial migration
dotnet ef migrations add InitialCreate

# Create database and apply migrations
dotnet ef database update
```

### Step 5: Run the API

```bash
dotnet run
```

Or if using Visual Studio:
- Press F5 or click "Start Debugging"

The API will start at:
- **Swagger UI**: https://localhost:5001/swagger
- **API Base**: https://localhost:5001/api

### Step 6: Test the API

1. Open your browser and navigate to: `https://localhost:5001/swagger`
2. You'll see the Swagger UI with all available endpoints
3. Try these endpoints to verify everything works:

   **a. Get all beers:**
   - Click on `GET /api/beers`
   - Click "Try it out"
   - Click "Execute"
   - You should see a list of German beers

   **b. Register a user:**
   - Click on `POST /api/auth/register`
   - Click "Try it out"
   - Fill in the request body:
   ```json
   {
     "firstName": "John",
     "lastName": "Doe",
     "email": "john@example.com",
     "password": "Test123!",
     "confirmPassword": "Test123!",
     "dateOfBirth": "1990-01-01",
     "isOver18": true
   }
   ```
   - Click "Execute"
   - Copy the `token` from the response

   **c. Use the token for authenticated requests:**
   - Click the "Authorize" button at the top
   - Enter: `Bearer YOUR_TOKEN_HERE` (replace with your actual token)
   - Click "Authorize"
   - Now you can access protected endpoints like `/api/cart`

## Common Issues and Solutions

### Issue: "No executable found matching command dotnet-ef"
**Solution:**
```bash
dotnet tool install --global dotnet-ef
```

### Issue: "Cannot open database"
**Solution:**
- Verify SQL Server is running
- Check your connection string in `appsettings.json`
- Try connecting to SQL Server with SQL Server Management Studio (SSMS) first

### Issue: "The SSL connection could not be established"
**Solution:**
Add `TrustServerCertificate=true` to your connection string

### Issue: Port already in use
**Solution:**
Change the ports in `Properties/launchSettings.json`:
```json
"applicationUrl": "https://localhost:5002;http://localhost:5003"
```

## Connecting to Angular Frontend

1. Make sure CORS is configured in `appsettings.json`:
```json
"CorsSettings": {
  "AllowedOrigins": [
    "http://localhost:4200"
  ]
}
```

2. In your Angular app, update the API base URL to point to: `https://localhost:5001/api`

3. Example Angular service:
```typescript
import { HttpClient } from '@angular/common/http';

export class ApiService {
  private baseUrl = 'https://localhost:5001/api';

  constructor(private http: HttpClient) {}

  getBeers() {
    return this.http.get(`${this.baseUrl}/beers`);
  }

  login(credentials: any) {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }
}
```

## Database Management

### View the database:
- Use **SQL Server Management Studio (SSMS)**
- Or **Azure Data Studio**
- Or Visual Studio's **SQL Server Object Explorer**

### Add new migration:
```bash
dotnet ef migrations add MigrationName
dotnet ef database update
```

### Reset database:
```bash
dotnet ef database drop
dotnet ef database update
```

### Seed more data:
Edit `Data/DbInitializer.cs` and add more items to the seed data.

## Production Deployment

Before deploying to production:

1. **Generate a secure JWT secret key:**
   ```csharp
   // Use this in appsettings.Production.json
   var key = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
   ```

2. **Update appsettings.Production.json:**
   - Change connection string to production database
   - Update CORS allowed origins
   - Set strong JWT secret key

3. **Enable HTTPS:**
   - In `Program.cs`, set `RequireHttpsMetadata = true`

4. **Build for production:**
   ```bash
   dotnet publish -c Release
   ```

## Support

For issues or questions:
- Check the README.md for API documentation
- Review Swagger UI for endpoint details
- Check Entity Framework logs in the console for database issues
