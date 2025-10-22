# 🚀 Quick Fix Guide - Get Everything Working Now!

## The Error You're Getting

```
HTTPConnectionPool(host='localhost', port=5000): Max retries exceeded
No connection could be made because the target machine actively refused it
```

**This means:** The detection API server is not running on port 5000.

---

## ✅ Solution - 3 Easy Steps

### **Step 1: Start the Test Detection API**

Open a **NEW PowerShell/Terminal window** and run:

```powershell
# Navigate to project root
cd "C:\Users\emert\Music\Whitefly detection"

# Option A: Use the PowerShell script
.\start-test-api.ps1

# OR Option B: Run directly
python detection_api_test.py
```

You should see:
```
============================================================
🧪 TEST DETECTION API SERVER
============================================================
Server running on: http://localhost:5000
```

**Keep this window open!** Don't close it.

---

### **Step 2: Make Sure Django is Running**

In your **backend terminal** (where you have venv activated):

```bash
# If not already running
cd backend
python manage.py runserver
```

---

### **Step 3: Test the Upload**

1. Go to `http://localhost:5173` in your browser
2. Login to your account
3. Upload any image (JPG, PNG, GIF)
4. You should see detection results!

---

## 🎯 What Each Server Does

### **Port 5000 - Detection API** (NEW - You need to start this!)
- Receives images
- Returns detection coordinates
- **Status:** ❌ Not running (that's why you get the error)
- **Fix:** Run `python detection_api_test.py`

### **Port 8000 - Django Backend**
- Handles authentication
- Saves images to database
- Calls the detection API
- **Status:** ✅ Running

### **Port 5173 - React Frontend**
- User interface
- Upload forms
- Display results
- **Status:** ✅ Running

---

## 📋 Complete Startup Checklist

### Terminal 1: Detection API (Port 5000)
```bash
cd "C:\Users\emert\Music\Whitefly detection"
python detection_api_test.py
```
✅ Should show: "Server running on: http://localhost:5000"

### Terminal 2: Django Backend (Port 8000)
```bash
cd "C:\Users\emert\Music\Whitefly detection\backend"
python manage.py runserver
```
✅ Should show: "Starting development server at http://127.0.0.1:8000/"

### Terminal 3: React Frontend (Port 5173)
```bash
cd "C:\Users\emert\Music\Whitefly detection\frontend"
npm run dev
```
✅ Should show: "Local: http://localhost:5173/"

---

## 🔧 Troubleshooting

### Error: "can't open file detection_api_test.py"
**Problem:** You're in the wrong directory (backend folder)
**Solution:** 
```bash
cd ..
python detection_api_test.py
```

### Error: "No module named 'flask'"
**Problem:** Flask is not installed
**Solution:**
```bash
pip install Flask flask-cors
```

### Error: "Port 5000 is already in use"
**Problem:** Another program is using port 5000
**Solution:**
```bash
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Upload still fails after starting API
**Problem:** API might have crashed
**Solution:**
1. Check the API terminal for errors
2. Restart the API: `python detection_api_test.py`
3. Try uploading again

---

## 🎨 New Sidebar Features

After fixing the upload, you'll see the new sidebar with:

✅ **Clean white background** - No more dark/invisible sidebar
✅ **User profile** - Your avatar, name, and email at the top
✅ **Clear navigation** - Dashboard, History, Analytics, etc.
✅ **System status** - Green "System Online" indicator at bottom
✅ **Professional design** - Standard enterprise layout

---

## 📝 Quick Commands Reference

### Start Everything (3 separate terminals):

**Terminal 1:**
```bash
cd "C:\Users\emert\Music\Whitefly detection"
python detection_api_test.py
```

**Terminal 2:**
```bash
cd "C:\Users\emert\Music\Whitefly detection\backend"
python manage.py runserver
```

**Terminal 3:**
```bash
cd "C:\Users\emert\Music\Whitefly detection\frontend"
npm run dev
```

### Check if servers are running:
```bash
# Check port 5000 (Detection API)
curl http://localhost:5000/health

# Check port 8000 (Django)
curl http://localhost:8000/admin/

# Check port 5173 (React)
# Just open in browser: http://localhost:5173
```

---

## ✨ That's It!

Once all three servers are running, you can:
1. Upload images
2. See detection results
3. Download annotated images
4. Export CSV reports

The test API returns **random detection coordinates** for testing. For real detections, you'll need to implement a proper YOLOv8 inference API later.

---

## 🆘 Still Having Issues?

Check the console output in each terminal window for error messages and share them for help!
