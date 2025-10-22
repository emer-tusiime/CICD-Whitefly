# Whitefly Detection Web Application

A modern web application for detecting and counting whiteflies in agricultural images using computer vision and machine learning.

## Technology Stack

### Backend
- **Django 4.1.5** - Web framework
- **Django REST Framework** - API endpoints
- **OpenCV** - Image processing
- **SQLite** - Database
- **YOLOv8** - Object detection model

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Dropzone** - File uploads
- **Lucide React** - Icons

## Project Structure

```
Whitefly detection/
├── backend/                 # Django REST API
│   ├── Whitefly_web/       # Django project settings
│   ├── whitefly/           # Django app
│   │   ├── api_views.py    # REST API views
│   │   ├── api_urls.py     # API routing
│   │   ├── serializers.py  # DRF serializers
│   │   ├── models.py       # Database models
│   │   ├── utilities.py    # Image processing
│   │   └── weights/        # YOLOv8 model
│   ├── manage.py
│   └── requirements.txt
├── frontend/               # React SPA
│   ├── src/
│   │   ├── api/           # API configuration
│   │   ├── components/    # React components
│   │   ├── context/       # Auth context
│   │   └── App.jsx        # Main app
│   └── package.json
├── README.md              # This file
└── start-dev.ps1          # Start script
```

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create media directories**
   ```bash
   mkdir media\whitefly_uploads media\whitefly_results media\csv
   ```

5. **Run migrations**
   ```bash
   python manage.py migrate
   ```

6. **Create superuser (optional)**
   ```bash
   python manage.py createsuperuser
   ```

7. **Start Django server**
   ```bash
   python manage.py runserver
   ```
   Backend will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

### Detection API Setup (REQUIRED)

⚠️ **IMPORTANT**: The application requires a separate detection API server running on `localhost:5000`

This API server is **NOT included** in this repository and must be set up separately. It should:
- Accept POST requests to `/post_single_file/` or `/multi_file_async/`
- Load the YOLOv8 model from `whitefly/weights/best-13.pt`
- Return detection results in JSON format with bounding box coordinates

Example response format:
```json
[
  {
    "result": [
      {
        "0": {
          "xmin": 100,
          "ymin": 150,
          "xmax": 200,
          "ymax": 250
        }
      }
    ]
  }
]
```

## Usage

1. **Access the application**
   - Open browser to `http://localhost:5173`

2. **Create an account**
   - Click "Sign up" and create a new account

3. **Login**
   - Sign in with your credentials

4. **Upload images**
   - Drag and drop images or click to select
   - Supports JPG, JPEG, PNG, GIF formats
   - Multiple images can be uploaded at once

5. **View results**
   - See annotated images with bounding boxes
   - View whitefly count for each image
   - Download individual images or CSV report

## API Endpoints

### Authentication
- `POST /api/auth/signup/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/logout/` - Logout user
- `GET /api/auth/user/` - Get current user

### Image Processing
- `POST /api/upload/` - Upload and process images
- `GET /api/images/` - Get user's uploaded images
- `GET /api/results/` - Get user's detection results
- `GET /api/results/<id>/` - Get specific result details

## Features

✅ User authentication and authorization  
✅ Drag-and-drop image upload  
✅ Multiple image processing  
✅ Real-time detection results  
✅ Annotated image visualization  
✅ CSV export of results  
✅ Responsive modern UI  
✅ Session-based authentication  

## Known Issues & Missing Components

1. **Detection API Server** - Must be implemented separately
2. **Model Dependencies** - Need to install PyTorch and Ultralytics for model inference
3. **Production Configuration** - Current settings are for development only
4. **Error Handling** - Limited error handling for API failures
5. **Tests** - No test coverage yet

## Development

### Running in Development Mode

**Terminal 1 - Django Backend:**
```bash
python manage.py runserver
```

**Terminal 2 - React Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 3 - Detection API (when implemented):**
```bash
# Your detection API server on port 5000
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

The build output will be in `frontend/dist/`

## Environment Variables

Create a `.env` file in the root directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

Copyright © 2023 NextGEN - Whitefly Detection Web Application

## Contact

For questions or issues, please contact: tusubirafrancisjeremy@gmail.com
