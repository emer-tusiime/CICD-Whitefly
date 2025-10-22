# PowerShell script to start the test detection API

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Starting Test Detection API Server" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Flask is installed
Write-Host "Checking Flask installation..." -ForegroundColor Yellow
pip show Flask | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Flask not found. Installing Flask and flask-cors..." -ForegroundColor Yellow
    pip install Flask flask-cors
} else {
    Write-Host "Flask is already installed." -ForegroundColor Green
}

Write-Host ""
Write-Host "Starting server on http://localhost:5000" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the detection API
python detection_api_test.py
