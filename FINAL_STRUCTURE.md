# Whitefly Detection - Final Clean Project Structure

## Overview
Fully separated backend and frontend architecture
- Backend: Django REST API (Python)
- Frontend: React SPA (JavaScript)

## Directory Structure

```
Whitefly detection/
│
├── backend/                              # DJANGO REST API
│   ├── Whitefly_web/                     # Django project config
│   │   ├── settings.py                   # Settings (CORS, REST)
│   │   └── urls.py                       # URL routing
│   ├── whitefly/                         # Django app
│   │   ├── api_views.py                  # REST API views
│   │   ├── api_urls.py                   # API routing
│   │   ├── serializers.py                # DRF serializers
│   │   ├── models.py                     # Database models
│   │   ├── utilities.py                  # Image processing
│   │   ├── admin.py                      # Admin config
│   │   └── weights/                      # ML model
│   │       └── best-13.pt
│   ├── media/                            # User uploads
│   ├── manage.py
│   ├── requirements.txt
│   └── README.md
│
├── frontend/                             # REACT SPA
│   ├── src/
│   │   ├── api/axios.js                  # API client
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/AuthContext.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── README.md                             # Main docs
├── QUICKSTART.md                         # Quick start
└── start-dev.ps1                         # Start script
```

## Files Removed

- templates_old_backup/ - Old HTML templates
- static_old_backup/ - Old CSS/JS files
- forms_old_backup.py - Old Django forms
- views.py - Empty legacy views
- urls.py - Empty legacy URLs
- tests.py - Empty test file

## Technology Stack

### Backend
- Django 4.1.5
- Django REST Framework 3.14.0
- Django CORS Headers 3.13.0
- OpenCV, Pillow, NumPy

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router
- Axios
- React Dropzone

## API Endpoints

### Authentication
- POST /api/auth/signup/
- POST /api/auth/login/
- POST /api/auth/logout/
- GET /api/auth/user/

### Images
- POST /api/upload/
- GET /api/images/
- GET /api/results/
- GET /api/results/id/

### Admin
- GET /admin/

## Running the Application

### Backend
```bash
cd backend
python manage.py runserver
# http://localhost:8000
```

### Frontend
```bash
cd frontend
npm run dev
# http://localhost:5173
```

### Quick Start
```bash
.\start-dev.ps1
```

## Data Flow

1. User interacts with React (localhost:5173)
2. React calls Django API (localhost:8000/api/)
3. Django processes and calls Detection API (localhost:5000)
4. Results saved to database
5. React displays results

## Notes

- Django serves ONLY REST API
- React handles ALL UI and routing
- No Django templates used
- CORS configured for React-Django communication
- Session-based authentication
