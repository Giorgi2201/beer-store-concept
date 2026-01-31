# 🚀 Beer Store API - Quick Start Checklist

## ✅ Pre-Flight Checklist

Use this checklist to get your API up and running in 5 minutes!

---

### □ Step 1: Verify Prerequisites

```bash
# Check .NET version (should be 8.0 or higher)
dotnet --version
```

**Don't have .NET 8.0?** Download from: https://dotnet.microsoft.com/download/dotnet/8.0

---

### □ Step 2: Navigate to Project Directory

```bash
cd "C:\Users\Giorgi\Desktop\Angular Training\beer-store-concept\BeerStore.API"
```

---

### □ Step 3: Restore NuGet Packages

```bash
dotnet restore
```

**Expected output**: All packages should restore successfully with no errors.

---

### □ Step 4: Verify SQL Server Connection

**Option A: Using LocalDB (Recommended for Development)**
- Already configured in `appsettings.json`
- No action needed!

**Option B: Using SQL Server Express**
- Edit `appsettings.json`
- Change connection string to: `Server=.\\SQLEXPRESS;...`

**Test your connection:**
```bash
# This will test if SQL Server is accessible
sqlcmd -S (localdb)\mssqllocaldb -Q "SELECT @@VERSION"
```

---

### □ Step 5: Install Entity Framework Tools

```bash
dotnet tool install --global dotnet-ef
```

**Already installed?** You'll get a message saying it's already installed. That's fine!

---

### □ Step 6: Create Database

```bash
# Create initial migration
dotnet ef migrations add InitialCreate

# Apply migration and create database
dotnet ef database update
```

**Expected output**: 
- Migration files created in `Data/Migrations/`
- Database `BeerStoreDb` created
- Tables created with seed data

---

### □ Step 7: Run the API

```bash
dotnet run
```

**Expected output**:
```
Building...
info: Microsoft.Hosting.Lifetime[14]
      Now listening on: https://localhost:5001
      Now listening on: http://localhost:5000
```

---

### □ Step 8: Test with Swagger

1. **Open browser**: https://localhost:5001/swagger
2. **You should see**: Swagger UI with all API endpoints listed

---

### □ Step 9: Test API Endpoints

#### Test 1: Get All Beers
1. In Swagger, find `GET /api/beers`
2. Click "Try it out"
3. Click "Execute"
4. **Expected**: List of 16 German beers

#### Test 2: Register a User
1. Find `POST /api/auth/register`
2. Click "Try it out"
3. Paste this JSON:
```json
{
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com",
  "password": "Test123!",
  "confirmPassword": "Test123!",
  "dateOfBirth": "1990-01-01",
  "isOver18": true
}
```
4. Click "Execute"
5. **Expected**: Success response with a JWT token
6. **IMPORTANT**: Copy the `token` value!

#### Test 3: Authorize and Access Protected Endpoint
1. Click the **"Authorize"** button at the top of Swagger
2. Paste: `Bearer YOUR_TOKEN_HERE` (replace with your actual token)
3. Click "Authorize"
4. Find `GET /api/cart`
5. Click "Try it out" → "Execute"
6. **Expected**: Empty cart for new user

---

### □ Step 10: Connect to Angular

In your Angular app, update your API service:

```typescript
// src/app/services/api.service.ts
private baseUrl = 'https://localhost:5001/api';
```

Make sure CORS is configured (already done in `appsettings.json`):
```json
"AllowedOrigins": ["http://localhost:4200"]
```

---

## 🎉 Success!

Your API is now running! You should have:
- ✅ 52 files created
- ✅ Database with 16 beers pre-loaded
- ✅ All endpoints accessible via Swagger
- ✅ JWT authentication working
- ✅ Ready to connect to Angular frontend

---

## 🔧 Common Issues & Quick Fixes

### Issue: "Build failed"
```bash
# Clean and rebuild
dotnet clean
dotnet restore
dotnet build
```

### Issue: "Port already in use"
Edit `Properties/launchSettings.json` and change ports:
```json
"applicationUrl": "https://localhost:5002;http://localhost:5003"
```

### Issue: "Cannot connect to database"
1. Verify SQL Server is running
2. Check connection string in `appsettings.json`
3. Try: `dotnet ef database drop` then `dotnet ef database update`

### Issue: "Migration already applied"
```bash
# Remove last migration
dotnet ef migrations remove

# Or drop and recreate database
dotnet ef database drop
dotnet ef database update
```

---

## 📚 Next Steps

1. **Read the documentation**:
   - `README.md` - API overview
   - `SETUP_INSTRUCTIONS.md` - Detailed setup
   - `PROJECT_SUMMARY.md` - Complete feature list

2. **Explore the code**:
   - Start with `Controllers/` to see endpoints
   - Check `Services/` for business logic
   - Review `Models/Entities/` for database structure

3. **Customize**:
   - Add more beers in `Data/DbInitializer.cs`
   - Create new endpoints in `Controllers/`
   - Modify authentication in `Services/AuthService.cs`

4. **Test integration**:
   - Connect your Angular frontend
   - Test login → add to cart → checkout flow
   - Implement real-time cart updates

---

## 🆘 Need Help?

1. Check the error message carefully
2. Review `SETUP_INSTRUCTIONS.md` for detailed troubleshooting
3. Check the console output for Entity Framework errors
4. Verify all steps in this checklist were completed

---

## 📊 What's Running?

When API is running:
- **Swagger UI**: https://localhost:5001/swagger
- **Base API URL**: https://localhost:5001/api
- **Database**: BeerStoreDb on SQL Server LocalDB
- **Seed Data**: 16 beers, 12 categories

---

**Time to Complete**: ~5 minutes  
**Difficulty**: Beginner-friendly  
**Files Created**: 52  
**Lines of Code**: ~3,500  

Good luck! 🍺
