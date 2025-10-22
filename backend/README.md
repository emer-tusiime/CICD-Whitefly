# Whitefly Detection - Backend API

Django REST API for whitefly detection and counting.

## Setup

1. **Create virtual environment**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Create media directories**
   ```bash
   mkdir media\whitefly_uploads media\whitefly_results media\csv
   ```

4. **Run migrations**
   ```bash
   python manage.py migrate
   ```

5. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start server**
   ```bash
   python manage.py runserver
   ```

Server runs on `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/auth/signup/` - Register
- `POST /api/auth/login/` - Login
- `POST /api/auth/logout/` - Logout
- `GET /api/auth/user/` - Current user

### Images
- `POST /api/upload/` - Upload & process images
- `GET /api/images/` - Get user images
- `GET /api/results/` - Get results
- `GET /api/results/<id>/` - Get result detail

### Admin
- `GET /admin/` - Admin panel

## Requirements

- Python 3.8+
- Detection API running on `localhost:5000`

## Tech Stack

- Django 4.1.5
- Django REST Framework
- OpenCV
- Pillow
- NumPy
