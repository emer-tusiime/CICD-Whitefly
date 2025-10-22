# Test Detection API Guide

## Quick Start - Testing the Upload Feature

The application requires a detection API running on port 5000. For testing purposes, we've included a **mock detection API** that returns random detection results.

### Step 1: Install Flask (if not already installed)

```bash
pip install -r detection_api_requirements.txt
```

Or install manually:
```bash
pip install Flask flask-cors
```

### Step 2: Start the Test Detection API

Open a **new terminal** and run:

```bash
python detection_api_test.py
```

You should see:
```
============================================================
🧪 TEST DETECTION API SERVER
============================================================
This is a MOCK server for testing purposes only.
It returns random detection coordinates without ML inference.

Server running on: http://localhost:5000
Endpoints:
  - POST /post_single_file/
  - POST /multi_file_async/
  - GET  /health
============================================================
```

### Step 3: Start Django Backend

In another terminal:
```bash
cd backend
python manage.py runserver
```

### Step 4: Start React Frontend

In another terminal:
```bash
cd frontend
npm run dev
```

### Step 5: Test Upload

1. Open browser to `http://localhost:5173`
2. Login or create an account
3. Upload any image (JPG, PNG, GIF)
4. You should see detection results with random bounding boxes

## What's Different?

### ✅ Fixed Issues:
1. **Better error handling** - Now shows clear error messages
2. **Auto-creates directories** - Media folders created automatically
3. **Improved logging** - Backend prints detailed error traces
4. **Mock API included** - Test without ML model

### 🎨 Sidebar Improvements:
1. **Dark gradient theme** - Modern slate/emerald color scheme
2. **User profile section** - Shows avatar with online status
3. **Glowing active states** - Visual feedback for current page
4. **System status footer** - Shows operational status
5. **Smooth animations** - Professional transitions
6. **Collapsible design** - Toggle between full and compact view

## Troubleshooting

### Error: "Detection API connection failed"
- Make sure `detection_api_test.py` is running on port 5000
- Check that no other service is using port 5000

### Error: "No module named 'flask'"
- Run: `pip install Flask flask-cors`

### Upload works but no bounding boxes visible
- The test API returns random coordinates
- Some may be outside the image bounds (this is expected for testing)
- With a real YOLOv8 model, coordinates will be accurate

## Next Steps

To use the **real YOLOv8 model**:

1. Install PyTorch and Ultralytics:
   ```bash
   pip install torch ultralytics
   ```

2. Create a proper detection API that:
   - Loads the model from `backend/whitefly/weights/best-13.pt`
   - Runs inference on uploaded images
   - Returns actual detection coordinates

3. Replace the test API with your production API

## Notes

- The test API is **NOT for production use**
- It returns random coordinates for testing only
- Real detection requires YOLOv8 model inference
- The mock API helps verify the upload pipeline works correctly
