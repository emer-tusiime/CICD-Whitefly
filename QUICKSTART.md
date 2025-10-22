# Quick Start Guide

## First Time Setup

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # Optional: for admin access
mkdir media\whitefly_uploads media\whitefly_results media\csv
cd ..
```

### 2. Frontend Setup
```bash
cd frontend
npm install
cd ..
```

## Running the Application

### Option 1: Using PowerShell Script (Recommended)
```bash
.\start-dev.ps1
```

### Option 2: Manual Start

**Terminal 1 - Django Backend:**
```bash
cd backend
python manage.py runserver
```

**Terminal 2 - React Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Detection API (REQUIRED):**
```bash
# You need to implement and start your detection API server on port 5000
# This is the ML inference server that processes images
```

## Access the Application

1. Open browser to: `http://localhost:5173`
2. Click "Sign up" to create an account
3. Login with your credentials
4. Upload images and view detection results

## Important Notes

⚠️ **The Detection API on port 5000 is REQUIRED but NOT included**

The application expects a detection API running on `http://localhost:5000` that:
- Accepts POST requests with image files
- Runs YOLOv8 inference using `whitefly/weights/best-13.pt`
- Returns detection coordinates in JSON format

Without this API, image uploads will fail with an error message.

## Troubleshooting

### CORS Errors
- Make sure Django is running on port 8000
- Check that CORS settings in `Whitefly_web/settings.py` include your frontend URL

### Upload Fails
- Verify the detection API is running on port 5000
- Check Django console for error messages
- Ensure media directories exist

### Authentication Issues
- Clear browser cookies and try again
- Check Django session middleware is enabled
- Verify CSRF token is being sent with requests

## Next Steps

1. Implement the detection API server (Flask/FastAPI)
2. Test with sample whitefly images
3. Configure for production deployment
4. Add additional features as needed
