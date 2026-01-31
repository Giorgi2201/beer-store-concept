# 🚀 START HERE - Beer Store Application

## Your Full-Stack Application is Ready!

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Start the Backend API
```powershell
cd "C:\Users\Giorgi\Desktop\Angular Training\beer-store-concept\BeerStore.API"
dotnet run
```
**Wait for:** `Now listening on: https://localhost:5001`

### Step 2: Start the Frontend
**Open a NEW terminal:**
```powershell
cd "C:\Users\Giorgi\Desktop\Angular Training\beer-store-concept"
ng serve
```
**Wait for:** `✔ Compiled successfully`

### Step 3: Open in Browser
**Navigate to:** http://localhost:4200

### Step 4: Test It!
1. Click **"Login"** → **"Sign Up"**
2. Create an account
3. Scroll to **"Best Sellers"**
4. Click **"Add to Cart"** on any beer
5. See cart badge update! 🎉

---

## 📚 Documentation

| File | Purpose |
|------|---------|
| **INTEGRATION_COMPLETE.md** | Complete integration overview |
| **CONNECTION_GUIDE.md** | Troubleshooting & testing guide |
| **test-connection.ps1** | Automated connection test |

---

## 🔍 Quick Test

Run this in PowerShell to verify everything is connected:
```powershell
cd "C:\Users\Giorgi\Desktop\Angular Training\beer-store-concept"
.\test-connection.ps1
```

---

## ✅ What's Working

- ✅ User Registration & Login (with JWT)
- ✅ Beer Catalog (loaded from database)
- ✅ Add to Cart (requires login)
- ✅ Cart Badge Counter
- ✅ Medieval German Theme
- ✅ Full Frontend ↔ Backend ↔ Database connection

---

## 🆘 Problems?

1. **CORS Error?** → Check `BeerStore.API/appsettings.json` → CorsSettings
2. **Beers not loading?** → Make sure backend is running
3. **Database error?** → Run: `cd BeerStore.API; dotnet ef database update`

**Full troubleshooting:** See `CONNECTION_GUIDE.md`

---

## 🎯 URLs

- **Frontend:** http://localhost:4200
- **Backend API:** https://localhost:5001/api
- **API Documentation:** https://localhost:5001/swagger

---

## 📁 Project Structure

```
beer-store-concept/
├── BeerStore.API/           # ← Backend (ASP.NET Core)
│   ├── Controllers/
│   ├── Services/
│   ├── Repositories/
│   ├── Models/
│   └── appsettings.json
├── src/                     # ← Frontend (Angular)
│   ├── app/
│   │   ├── services/        # API integration
│   │   ├── header/
│   │   ├── main-website/
│   │   └── ...
│   └── environments/
└── Documentation files
```

---

**Happy Coding! 🍺**
