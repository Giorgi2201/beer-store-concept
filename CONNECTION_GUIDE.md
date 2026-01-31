# 🔗 Complete Connection Guide
## Frontend ↔ Backend ↔ Database Integration

This guide ensures your Angular frontend, ASP.NET Core backend, and SQL Server database are properly connected.

---

## ✅ Pre-Flight Checklist

### 1. Verify Backend is Running

**Terminal 1 - Backend API:**
```bash
cd "C:\Users\Giorgi\Desktop\Angular Training\beer-store-concept\BeerStore.API"
dotnet run
```

**Expected Output:**
```
Now listening on: https://localhost:5001
Now listening on: http://localhost:5000
```

**Verify Swagger:** Open https://localhost:5001/swagger
- You should see the API documentation
- Try `GET /api/beers` - should return beers

---

### 2. Verify Database is Created

```bash
cd "C:\Users\Giorgi\Desktop\Angular Training\beer-store-concept\BeerStore.API"

# Check if database exists
dotnet ef database update
```

**Expected:** Database `BeerStoreDb` exists with seed data (16 beers)

**To verify in SQL Server:**
```sql
USE BeerStoreDb;
SELECT COUNT(*) FROM Beers;  -- Should return 16
SELECT COUNT(*) FROM Categories;  -- Should return 12
```

---

### 3. Verify Frontend Configuration

**Check environment files exist:**
- `src/environments/environment.ts`
- `src/environments/environment.development.ts`

**Both should contain:**
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:5001/api'
};
```

---

### 4. Run Angular Frontend

**Terminal 2 - Angular App:**
```bash
cd "C:\Users\Giorgi\Desktop\Angular Training\beer-store-concept"
ng serve
```

**Expected Output:**
```
Angular Live Development Server is listening on localhost:4200
✔ Compiled successfully
```

**Open:** http://localhost:4200

---

## 🧪 Testing the Connection

### Test 1: Open Browser Console
1. Open http://localhost:4200
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Look for any errors (there should be none)

**If you see CORS errors**, go to [CORS Troubleshooting](#cors-troubleshooting)

### Test 2: Check Network Requests
1. In Developer Tools, go to **Network** tab
2. Refresh the page
3. Look for requests to `localhost:5001/api/beers/best-sellers`
4. Click on the request
5. Check **Response** tab - should see JSON beer data

### Test 3: Login Flow (Full Integration Test)

#### Step 1: Register a New User
1. Click **"Login"** button in header
2. Click **"Sign Up"** button
3. Fill in the form:
   - First Name: `Test`
   - Last Name: `User`
   - Email: `test@example.com`
   - Password: `Test123!`
   - Confirm Password: `Test123!`
   - Check "Over 18" checkbox
4. Click **"Sign Up"**

**What should happen:**
- ✅ Request sent to `POST /api/auth/register`
- ✅ Response received with JWT token
- ✅ Token stored in localStorage
- ✅ Modal closes
- ✅ Header shows "Test" instead of "Login"

**In Browser Console, type:**
```javascript
localStorage.getItem('token')
```
**Expected:** Should return a long JWT token string

#### Step 2: Verify Cart Access
1. Click **"Cart"** button in header
2. **Should NOT ask for login** (you're already logged in)
3. **Should show:** Alert "Cart functionality will be added soon!"

#### Step 3: Add Beer to Cart
1. Scroll down to **"Best Sellers"** section
2. Click on any beer category card
3. Click **"Add to cart"** on a beer
4. **Expected:** Alert "Beer added to cart!"
5. **Cart badge should update** with item count

---

## 🔧 Troubleshooting

### CORS Troubleshooting

**Symptom:** Console shows:
```
Access to XMLHttpRequest at 'https://localhost:5001/api/beers' from origin 'http://localhost:4200' 
has been blocked by CORS policy
```

**Solution:**

1. **Check Backend CORS Configuration**

Open: `beer-store-concept/BeerStore.API/appsettings.json`

Verify:
```json
"CorsSettings": {
  "AllowedOrigins": [
    "http://localhost:4200",
    "http://localhost:4201"
  ]
}
```

2. **Restart Backend**
```bash
# Stop the backend (Ctrl+C)
# Then restart:
dotnet run
```

---

### SSL Certificate Errors

**Symptom:** `ERR_CERT_AUTHORITY_INVALID` in console

**Solution:**

**Option 1: Trust the Development Certificate**
```bash
dotnet dev-certs https --trust
```

**Option 2: Use HTTP instead**

Change `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'  // Changed from https:5001
};
```

---

### 401 Unauthorized Errors

**Symptom:** Cart or protected endpoints return 401

**Cause:** JWT token expired or invalid

**Solution:**
1. Logout and login again
2. Check localStorage:
```javascript
// In browser console
localStorage.clear();
// Then login again
```

---

### Backend Not Responding

**Check if API is running:**
```bash
# Windows
netstat -ano | findstr :5001

# Should show something like:
# TCP    0.0.0.0:5001           0.0.0.0:0              LISTENING       12345
```

**If nothing shows:**
- Backend is not running
- Run `dotnet run` in beer-store-concept/BeerStore.API folder

---

### Database Connection Errors

**Symptom:** Backend shows errors like:
```
Cannot open database "BeerStoreDb"
```

**Solutions:**

1. **Verify SQL Server is running:**
```bash
# Check LocalDB
sqllocaldb info mssqllocaldb
# Should show: RUNNING
```

2. **Create database if missing:**
```bash
cd "C:\Users\Giorgi\Desktop\Angular Training\beer-store-concept\BeerStore.API"
dotnet ef database update
```

3. **Check connection string:**

Open: `beer-store-concept/BeerStore.API/appsettings.json`

Verify:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=BeerStoreDb;Trusted_Connection=true;MultipleActiveResultSets=true"
}
```

---

### Angular Compilation Errors

**Symptom:**
```
Error: src/app/services/api.service.ts:5:21 - error TS2307: Cannot find module
```

**Solution:**
```bash
cd "C:\Users\Giorgi\Desktop\Angular Training\beer-store-concept"
npm install
ng serve
```

---

## 🔍 Verify Data Flow

### Frontend → Backend → Database

**Test sequence:**

1. **Frontend makes request:**
```typescript
// This happens when you load the page
apiService.getBestSellers()
```

2. **Backend receives request:**
```
GET https://localhost:5001/api/beers/best-sellers
```

3. **Backend queries database:**
```sql
SELECT * FROM Beers WHERE IsBestSeller = 1
```

4. **Database returns data:**
```
16 rows returned
```

5. **Backend sends response:**
```json
[
  {
    "id": 1,
    "name": "Paulaner Hefeweizen",
    "brand": "Paulaner",
    ...
  }
]
```

6. **Frontend displays data:**
```
Beers show up on the page
```

---

## 📊 Health Check Endpoints

### Manual API Testing (using browser or Postman)

**1. Get all beers:**
```
GET https://localhost:5001/api/beers
```

**2. Get best sellers:**
```
GET https://localhost:5001/api/beers/best-sellers
```

**3. Get available styles:**
```
GET https://localhost:5001/api/beers/styles
Response: ["Hefeweizen", "Pilsner", "Helles", ...]
```

**4. Test authentication:**
```
POST https://localhost:5001/api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Test123!",
  "confirmPassword": "Test123!",
  "dateOfBirth": "1990-01-01",
  "isOver18": true
}

Response: Should include JWT token
```

---

## ✅ Final Verification Checklist

Before you start developing, verify all of these:

- [ ] Backend runs without errors (`dotnet run`)
- [ ] Swagger UI loads (https://localhost:5001/swagger)
- [ ] Database has data (16 beers, 12 categories)
- [ ] Frontend compiles (`ng serve`)
- [ ] Frontend loads without console errors
- [ ] Best sellers show up on homepage
- [ ] No CORS errors in console
- [ ] Can register a new user
- [ ] JWT token appears in localStorage after login
- [ ] Header shows user name when logged in
- [ ] Can add beer to cart (shows alert)
- [ ] Cart badge updates

---

## 🚀 Quick Start Commands

**Start Everything (2 terminals):**

**Terminal 1 - Backend:**
```bash
cd "C:\Users\Giorgi\Desktop\Angular Training\beer-store-concept\BeerStore.API"
dotnet run
```

**Terminal 2 - Frontend:**
```bash
cd "C:\Users\Giorgi\Desktop\Angular Training\beer-store-concept"
ng serve
```

**Access:**
- Frontend: http://localhost:4200
- Backend Swagger: https://localhost:5001/swagger
- Backend API: https://localhost:5001/api

---

## 📝 Common Connection Issues Summary

| Issue | Symptom | Solution |
|-------|---------|----------|
| CORS | `blocked by CORS policy` | Check `appsettings.json` CORS settings |
| SSL | `ERR_CERT_AUTHORITY_INVALID` | Run `dotnet dev-certs https --trust` |
| 401 | `Unauthorized` | Logout and login again |
| Database | `Cannot open database` | Run `dotnet ef database update` |
| Port conflict | `Address already in use` | Change port in `launchSettings.json` |
| Missing data | Empty lists | Check database seed data |

---

## 💡 Tips

1. **Always start backend before frontend**
2. **Keep both terminals open** to see errors in real-time
3. **Check browser console** for frontend errors
4. **Check backend terminal** for API errors
5. **Use Swagger** to test API independently
6. **Clear localStorage** if auth issues persist
7. **Restart both servers** if strange errors occur

---

**Last Updated:** January 2026  
**Status:** ✅ Ready for Development
