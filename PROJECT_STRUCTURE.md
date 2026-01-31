# 📁 Beer Store - Complete Project Structure

## Overview

The **BeerStore.API** backend has been **moved inside** the `beer-store-concept` folder for better organization.

---

## 🗂️ New Project Structure

```
C:\Users\Giorgi\Desktop\Angular Training\
└── beer-store-concept/                      # Main project folder
    ├── BeerStore.API/                       # ← BACKEND (ASP.NET Core)
    │   ├── Controllers/
    │   │   ├── AuthController.cs
    │   │   ├── BeersController.cs
    │   │   ├── CartController.cs
    │   │   └── CategoriesController.cs
    │   ├── Services/
    │   │   ├── Interfaces/
    │   │   │   ├── IAuthService.cs
    │   │   │   ├── IBeerService.cs
    │   │   │   └── ICartService.cs
    │   │   └── Implementations/
    │   │       ├── AuthService.cs
    │   │       ├── BeerService.cs
    │   │       └── CartService.cs
    │   ├── Repositories/
    │   │   ├── Interfaces/
    │   │   └── Implementations/
    │   ├── Models/
    │   │   ├── Entities/
    │   │   │   ├── User.cs
    │   │   │   ├── Beer.cs
    │   │   │   ├── Cart.cs
    │   │   │   └── ...
    │   │   └── DTOs/
    │   │       ├── Auth/
    │   │       ├── Beer/
    │   │       └── Cart/
    │   ├── Data/
    │   │   ├── BeerStoreDbContext.cs
    │   │   └── DbInitializer.cs
    │   ├── Middleware/
    │   │   └── ErrorHandlingMiddleware.cs
    │   ├── Utilities/
    │   │   ├── JwtHelper.cs
    │   │   └── PasswordHasher.cs
    │   ├── Configuration/
    │   │   ├── JwtSettings.cs
    │   │   └── CorsSettings.cs
    │   ├── Properties/
    │   │   └── launchSettings.json
    │   ├── BeerStore.API.csproj
    │   ├── Program.cs
    │   ├── appsettings.json              # ← IMPORTANT: CORS, JWT, DB config
    │   ├── appsettings.Development.json
    │   ├── .gitignore
    │   ├── README.md
    │   ├── SETUP_INSTRUCTIONS.md
    │   ├── PROJECT_SUMMARY.md
    │   └── QUICK_START_CHECKLIST.md
    │
    ├── src/                                 # ← FRONTEND (Angular)
    │   ├── app/
    │   │   ├── services/                    # ← API Integration Services
    │   │   │   ├── api.service.ts
    │   │   │   ├── auth.service.ts
    │   │   │   ├── cart.service.ts
    │   │   │   ├── auth.interceptor.ts
    │   │   │   └── error.interceptor.ts
    │   │   ├── header/
    │   │   │   ├── header.component.ts
    │   │   │   ├── header.component.html
    │   │   │   └── header.component.css
    │   │   ├── main-website/
    │   │   ├── footer/
    │   │   ├── login-modal/
    │   │   ├── category-modal/
    │   │   ├── category-view/
    │   │   ├── app.component.ts
    │   │   ├── app.component.html
    │   │   └── app.config.ts              # ← HTTP Client & Interceptors
    │   ├── environments/
    │   │   ├── environment.ts              # ← API URL: localhost:5001
    │   │   └── environment.development.ts
    │   ├── assets/
    │   ├── index.html
    │   ├── main.ts
    │   └── styles.css
    │
    ├── public/
    │   └── favicon.ico
    │
    ├── angular.json
    ├── package.json
    ├── tsconfig.json
    │
    ├── CONNECTION_GUIDE.md                 # ← Troubleshooting guide
    ├── INTEGRATION_COMPLETE.md             # ← Integration overview
    ├── START_HERE.md                       # ← Quick start guide
    ├── PROJECT_STRUCTURE.md                # ← This file
    ├── test-connection.ps1                 # ← Automated test script
    └── README.md
```

---

## 🎯 Key Locations

### Backend Files
- **Main Entry:** `beer-store-concept/BeerStore.API/Program.cs`
- **Configuration:** `beer-store-concept/BeerStore.API/appsettings.json`
- **Database Context:** `beer-store-concept/BeerStore.API/Data/BeerStoreDbContext.cs`

### Frontend Files
- **API Services:** `beer-store-concept/src/app/services/`
- **Environment Config:** `beer-store-concept/src/environments/environment.ts`
- **HTTP Config:** `beer-store-concept/src/app/app.config.ts`

### Documentation
- **Start Here:** `beer-store-concept/START_HERE.md`
- **Connection Guide:** `beer-store-concept/CONNECTION_GUIDE.md`
- **Integration Details:** `beer-store-concept/INTEGRATION_COMPLETE.md`

---

## 🚀 How to Start

### Option 1: From Project Root
```powershell
# Terminal 1 - Backend
cd "C:\Users\Giorgi\Desktop\Angular Training\beer-store-concept\BeerStore.API"
dotnet run

# Terminal 2 - Frontend
cd "C:\Users\Giorgi\Desktop\Angular Training\beer-store-concept"
ng serve
```

### Option 2: From Inside beer-store-concept
```powershell
# Terminal 1 - Backend
cd BeerStore.API
dotnet run

# Terminal 2 - Frontend (from root)
ng serve
```

---

## ✅ Benefits of This Structure

1. **Single Repository** - Everything in one place
2. **Easy Git Management** - One `.git` folder for both projects
3. **Simpler Deployment** - Both apps in one repository
4. **Better Organization** - Clear separation of concerns
5. **Easier Collaboration** - Team members clone one repo

---

## 🔗 Communication Flow

```
Angular App (localhost:4200)
    ↓
HTTP Requests with JWT Token
    ↓
ASP.NET Core API (localhost:5001/api)
    ↓
Entity Framework Core
    ↓
SQL Server Database (BeerStoreDb)
```

---

## 📝 Important Notes

- **Both projects** share the same parent folder
- **Backend runs** on ports 5000 (HTTP) and 5001 (HTTPS)
- **Frontend runs** on port 4200
- **CORS is configured** to allow localhost:4200
- **JWT tokens** stored in browser localStorage
- **Database** created by Entity Framework migrations

---

## 🔄 Updated Paths Reference

| Item | Old Path | New Path |
|------|----------|----------|
| Backend | `C:\...\BeerStore.API` | `C:\...\beer-store-concept\BeerStore.API` |
| Frontend | `C:\...\beer-store-concept` | Same (no change) |
| appsettings | `BeerStore.API\appsettings.json` | `beer-store-concept\BeerStore.API\appsettings.json` |
| Services | `beer-store-concept\src\app\services` | Same (no change) |

---

**Last Updated:** January 2026  
**Status:** ✅ Structure Updated & Documented
