@echo off
echo ============================================================
echo Committing Deployment Configuration Files
echo ============================================================
echo.

echo Adding all files...
git add .

echo.
echo Committing changes...
git commit -m "Add CI/CD pipeline and deployment configuration

- Add GitHub Actions workflow for automated build and deploy
- Add Vercel configuration for frontend deployment
- Add Dockerfile for backend deployment to Render
- Add gunicorn for production server
- Add comprehensive deployment guide
- Configure environment variables and secrets
- Set up automated testing and deployment pipeline"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo ============================================================
echo Deployment files committed and pushed to GitHub!
echo ============================================================
echo.
echo Next steps:
echo 1. Set up Vercel account and import your repo
echo 2. Set up Render account for backend deployment
echo 3. Add GitHub Secrets for deployment tokens
echo 4. Watch your CI/CD pipeline deploy automatically!
echo.
pause
