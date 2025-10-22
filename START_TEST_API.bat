@echo off
echo ============================================================
echo Starting Test Detection API Server
echo ============================================================
echo.
echo Installing Flask if needed...
pip install Flask flask-cors
echo.
echo Starting server on http://localhost:5000
echo.
python detection_api_test.py
pause
