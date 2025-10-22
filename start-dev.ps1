# PowerShell script to start both Django and React dev servers

Write-Host "Starting Whitefly Detection Application..." -ForegroundColor Green

# Start Django server in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; python manage.py runserver"

# Wait a moment for Django to start
Start-Sleep -Seconds 2

# Start React dev server in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host "`nServers starting..." -ForegroundColor Yellow
Write-Host "Django Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host "React Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "`nNote: You still need to start the Detection API on port 5000" -ForegroundColor Red
