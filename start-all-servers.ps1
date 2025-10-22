# PowerShell script to start ALL three servers at once

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Starting WhiteFly Detection Application - ALL SERVERS" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Flask is installed
Write-Host "Checking dependencies..." -ForegroundColor Yellow
pip show Flask | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Installing Flask and flask-cors..." -ForegroundColor Yellow
    pip install Flask flask-cors
}

Write-Host ""
Write-Host "Starting all servers in separate windows..." -ForegroundColor Green
Write-Host ""

# Start Detection API (Port 5000) in a new window
Write-Host "1. Starting Detection API on port 5000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; Write-Host '=== DETECTION API (Port 5000) ===' -ForegroundColor Green; python detection_api_test.py"

# Wait a moment
Start-Sleep -Seconds 2

# Start Django Backend (Port 8000) in a new window
Write-Host "2. Starting Django Backend on port 8000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host '=== DJANGO BACKEND (Port 8000) ===' -ForegroundColor Green; python manage.py runserver"

# Wait a moment
Start-Sleep -Seconds 2

# Start React Frontend (Port 5173) in a new window
Write-Host "3. Starting React Frontend on port 5173..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host '=== REACT FRONTEND (Port 5173) ===' -ForegroundColor Green; npm run dev"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "All servers are starting in separate windows!" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Servers:" -ForegroundColor Yellow
Write-Host "  Detection API:  http://localhost:5000" -ForegroundColor White
Write-Host "  Django Backend: http://localhost:8000" -ForegroundColor White
Write-Host "  React Frontend: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Open your browser to: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "To stop servers: Close each PowerShell window" -ForegroundColor Yellow
Write-Host ""
