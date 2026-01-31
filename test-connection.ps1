# Beer Store - Connection Test Script
# This script tests all connections between Frontend, Backend, and Database

Write-Host "=" -NoNewline -ForegroundColor Cyan
Write-Host ("=" * 70) -ForegroundColor Cyan
Write-Host "  Beer Store - Connection Test" -ForegroundColor Yellow
Write-Host ("=" * 71) -ForegroundColor Cyan
Write-Host ""

$ErrorActionPreference = "SilentlyContinue"

# Test 1: Check if Backend API is running
Write-Host "[TEST 1] Checking if Backend API is running..." -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "https://localhost:5001/api/beers/best-sellers" -Method GET -SkipCertificateCheck -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✓ Backend API is RUNNING" -ForegroundColor Green
        Write-Host "   ✓ API responded with status: $($response.StatusCode)" -ForegroundColor Green
        $beers = $response.Content | ConvertFrom-Json
        Write-Host "   ✓ Returned $($beers.Count) beers" -ForegroundColor Green
    }
} catch {
    Write-Host "   ✗ Backend API is NOT RUNNING" -ForegroundColor Red
    Write-Host "   → Start backend with: cd BeerStore.API; dotnet run" -ForegroundColor Yellow
}
Write-Host ""

# Test 2: Check if database connection works
Write-Host "[TEST 2] Checking Database Connection..." -ForegroundColor White
try {
    $apiPath = "C:\Users\Giorgi\Desktop\Angular Training\beer-store-concept\BeerStore.API"
    if (Test-Path $apiPath) {
        Push-Location $apiPath
        $dbCheck = dotnet ef database update --no-build 2>&1
        if ($LASTEXITCODE -eq 0 -or $dbCheck -like "*already applied*") {
            Write-Host "   ✓ Database is CONNECTED" -ForegroundColor Green
            Write-Host "   ✓ Database 'BeerStoreDb' is accessible" -ForegroundColor Green
        } else {
            Write-Host "   ✗ Database connection issues" -ForegroundColor Red
            Write-Host "   → Run: dotnet ef database update" -ForegroundColor Yellow
        }
        Pop-Location
    } else {
        Write-Host "   ⚠ Backend folder not found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ⚠ Could not verify database" -ForegroundColor Yellow
}
Write-Host ""

# Test 3: Check Angular environment configuration
Write-Host "[TEST 3] Checking Angular Configuration..." -ForegroundColor White
$envPath = "C:\Users\Giorgi\Desktop\Angular Training\beer-store-concept\src\environments\environment.ts"
if (Test-Path $envPath) {
    $envContent = Get-Content $envPath -Raw
    if ($envContent -match "apiUrl.*localhost:5001") {
        Write-Host "   ✓ Environment configured correctly" -ForegroundColor Green
        Write-Host "   ✓ API URL points to: localhost:5001" -ForegroundColor Green
    } else {
        Write-Host "   ✗ API URL configuration issue" -ForegroundColor Red
        Write-Host "   → Check: src/environments/environment.ts" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ✗ Environment file not found" -ForegroundColor Red
}
Write-Host ""

# Test 4: Check if Angular app is running
Write-Host "[TEST 4] Checking if Angular App is running..." -ForegroundColor White
try {
    $response = Invoke-WebRequest -Uri "http://localhost:4200" -Method GET -TimeoutSec 3
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✓ Angular App is RUNNING" -ForegroundColor Green
        Write-Host "   ✓ App accessible at: http://localhost:4200" -ForegroundColor Green
    }
} catch {
    Write-Host "   ✗ Angular App is NOT RUNNING" -ForegroundColor Red
    Write-Host "   → Start Angular with: ng serve" -ForegroundColor Yellow
}
Write-Host ""

# Test 5: Check CORS configuration
Write-Host "[TEST 5] Checking CORS Configuration..." -ForegroundColor White
$appsettingsPath = "C:\Users\Giorgi\Desktop\Angular Training\beer-store-concept\BeerStore.API\appsettings.json"
if (Test-Path $appsettingsPath) {
    $appsettings = Get-Content $appsettingsPath -Raw | ConvertFrom-Json
    if ($appsettings.CorsSettings.AllowedOrigins -contains "http://localhost:4200") {
        Write-Host "   ✓ CORS configured correctly" -ForegroundColor Green
        Write-Host "   ✓ Frontend origin is allowed" -ForegroundColor Green
    } else {
        Write-Host "   ✗ CORS configuration issue" -ForegroundColor Red
        Write-Host "   → Add 'http://localhost:4200' to AllowedOrigins" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠ appsettings.json not found" -ForegroundColor Yellow
}
Write-Host ""

# Test 6: Check if required services exist
Write-Host "[TEST 6] Checking Angular Services..." -ForegroundColor White
$servicesPath = "C:\Users\Giorgi\Desktop\Angular Training\beer-store-concept\src\app\services"
$requiredServices = @("api.service.ts", "auth.service.ts", "cart.service.ts", "auth.interceptor.ts")
$servicesFound = 0
foreach ($service in $requiredServices) {
    if (Test-Path (Join-Path $servicesPath $service)) {
        $servicesFound++
    }
}
if ($servicesFound -eq $requiredServices.Count) {
    Write-Host "   ✓ All required services exist" -ForegroundColor Green
    Write-Host "   ✓ Found: $servicesFound/$($requiredServices.Count) services" -ForegroundColor Green
} else {
    Write-Host "   ⚠ Some services missing: $servicesFound/$($requiredServices.Count)" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host ("=" * 71) -ForegroundColor Cyan
Write-Host "  Test Summary" -ForegroundColor Yellow
Write-Host ("=" * 71) -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor White
Write-Host "  1. If Backend is not running: cd BeerStore.API; dotnet run" -ForegroundColor Cyan
Write-Host "  2. If Frontend is not running: ng serve" -ForegroundColor Cyan
Write-Host "  3. Open browser: http://localhost:4200" -ForegroundColor Cyan
Write-Host "  4. Check browser console for errors (F12)" -ForegroundColor Cyan
Write-Host ""
Write-Host "For detailed troubleshooting, see: CONNECTION_GUIDE.md" -ForegroundColor Yellow
Write-Host ("=" * 71) -ForegroundColor Cyan
