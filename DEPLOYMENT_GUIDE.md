# 🚀 WhiteFly AI - Deployment Guide

## 📋 Overview

Your WhiteFly AI Detection System will be deployed using:
- **Frontend**: Vercel (React/Vite)
- **Backend**: Render (Django REST API)
- **CI/CD**: GitHub Actions

---

## 🔧 Step 1: Set Up Vercel (Frontend)

### 1.1 Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account
3. Import your repository: `emer-tusiime/CICD-Whitefly`

### 1.2 Configure Vercel Project
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### 1.3 Get Vercel Tokens
1. Go to Vercel Dashboard → Settings → Tokens
2. Create a new token
3. Copy the token (you'll need it for GitHub Secrets)

### 1.4 Get Project IDs
Run in your terminal:
```bash
npx vercel link
cd frontend
npx vercel env ls
```

---

## 🐍 Step 2: Set Up Render (Backend)

### 2.1 Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account

### 2.2 Create Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repo: `emer-tusiime/CICD-Whitefly`
3. Configure:
   - **Name**: `whitefly-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn Whitefly_web.wsgi:application`

### 2.3 Environment Variables (Render)
Add these in Render Dashboard → Environment:
```
DJANGO_SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=your-render-url.onrender.com,localhost
CORS_ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
```

---

## 🔐 Step 3: GitHub Secrets

Go to your GitHub repo → Settings → Secrets and variables → Actions

Add these secrets:

### Vercel Secrets:
```
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
```

### Render Secrets:
```
RENDER_API_KEY=your-render-api-key
RENDER_SERVICE_ID=your-service-id
```

---

## 📝 Step 4: Update Configuration

### 4.1 Update Frontend API URL
In `frontend/src/api/axios.js`:
```javascript
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-url.onrender.com/api'
    : 'http://localhost:8000/api',
  // ... rest of config
});
```

### 4.2 Update Django Settings
In `backend/Whitefly_web/settings.py`:
```python
import os

# Production settings
if os.environ.get('RENDER'):
    DEBUG = False
    ALLOWED_HOSTS = [os.environ.get('ALLOWED_HOSTS', '').split(',')]
    
    # Database (you might want to use PostgreSQL in production)
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('DATABASE_NAME'),
            'USER': os.environ.get('DATABASE_USER'),
            'PASSWORD': os.environ.get('DATABASE_PASSWORD'),
            'HOST': os.environ.get('DATABASE_HOST'),
            'PORT': os.environ.get('DATABASE_PORT', '5432'),
        }
    }
```

---

## 🚀 Step 5: Deploy

### 5.1 Commit and Push
```bash
git add .
git commit -m "Add CI/CD pipeline and deployment configs"
git push origin main
```

### 5.2 Watch the Magic ✨
1. Go to GitHub → Actions tab
2. Watch your CI/CD pipeline run
3. Frontend deploys to Vercel automatically
4. Backend deploys to Render automatically

---

## 🔍 Step 6: Verify Deployment

### Frontend URLs:
- **Vercel**: `https://your-app.vercel.app`
- **Custom Domain**: Configure in Vercel dashboard

### Backend URLs:
- **Render**: `https://your-backend.onrender.com`
- **API Docs**: `https://your-backend.onrender.com/admin/`

---

## 🐛 Troubleshooting

### Common Issues:

1. **Build Fails**:
   - Check GitHub Actions logs
   - Ensure all dependencies are in requirements.txt/package.json

2. **CORS Errors**:
   - Update CORS_ALLOWED_ORIGINS in Django settings
   - Include your Vercel URL

3. **Database Issues**:
   - Render provides free PostgreSQL
   - Update DATABASE_URL in environment variables

4. **Static Files**:
   - Ensure `python manage.py collectstatic` runs in build

---

## 📊 Monitoring

### GitHub Actions:
- Build status: ✅ or ❌
- Deploy logs and errors
- Automatic rollbacks on failure

### Vercel:
- Real-time deployment logs
- Performance analytics
- Custom domains

### Render:
- Service health monitoring
- Automatic scaling
- Database backups

---

## 🎉 Success!

Once deployed, your WhiteFly AI Detection System will be:
- ✅ **Live** on the internet
- ✅ **Auto-deploying** on every push
- ✅ **Scalable** and production-ready
- ✅ **Monitored** with logs and analytics

**Your live URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-backend.onrender.com/api/`

---

## 🔄 Next Steps

1. **Custom Domain**: Add your own domain in Vercel
2. **SSL Certificate**: Automatic with Vercel/Render
3. **Database**: Upgrade to PostgreSQL for production
4. **Monitoring**: Add error tracking (Sentry)
5. **Analytics**: Add user analytics (Google Analytics)

**Your WhiteFly AI is now production-ready! 🚀**
