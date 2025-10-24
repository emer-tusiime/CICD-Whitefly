# 🚀 Grafana Monitoring - Quick Start Guide

Get your WhiteFly Detection app monitored in **15 minutes**!

---

## ✅ What's Already Done

Your application is **already configured** for monitoring! Here's what's set up:

### Frontend (React)
- ✅ Grafana Faro SDK installed
- ✅ Monitoring utilities created (`src/utils/monitoring.js`)
- ✅ Tracking for: uploads, detections, navigation, errors
- ✅ User identification on login/logout

### Backend (Django)
- ✅ Django Prometheus installed
- ✅ Metrics endpoint at `/metrics`
- ✅ Request/response tracking
- ✅ Database query monitoring

---

## 🎯 What You Need To Do

### Step 1: Create Grafana Cloud Account (5 min)

1. Go to [grafana.com/auth/sign-up](https://grafana.com/auth/sign-up/create-user)
2. Sign up (free, no credit card)
3. Choose stack name: `whitefly-monitoring`
4. Select your region

**You'll get:**
- Grafana URL: `https://your-stack.grafana.net`
- Username: Your email
- Password: What you set

---

### Step 2: Get Faro Credentials (3 min)

1. Log into Grafana Cloud
2. Go to **Frontend Observability** → **Faro**
3. Click **"Create Application"**
4. Name: `WhiteFly Frontend`
5. Click **Create**

**Copy these values:**
```
App ID: abc123xyz
Endpoint: https://faro-collector-xxx.grafana.net/collect
```

---

### Step 3: Add Environment Variables (5 min)

#### For Vercel (Frontend)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project: `cicd-whitefly-2ee8`
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```env
VITE_GRAFANA_FARO_URL=https://faro-collector-xxx.grafana.net/collect
VITE_GRAFANA_FARO_APP_ID=your-app-id
VITE_GRAFANA_FARO_APP_NAME=WhiteFly Frontend
VITE_GRAFANA_FARO_ENV=production
```

5. Click **Save**
6. **Redeploy** your app (Vercel → Deployments → Redeploy)

#### For Render (Backend)

1. Go to [render.com/dashboard](https://dashboard.render.com/)
2. Select your service: `whitefly-backend`
3. Go to **Environment**
4. Add:

```env
ENABLE_METRICS=True
```

5. Click **Save Changes**
6. Render will **auto-redeploy**

---

### Step 4: Verify It's Working (2 min)

#### Test Frontend Monitoring

1. Open your app: `https://cicd-whitefly-2ee8.vercel.app`
2. Login and upload an image
3. Go to Grafana Cloud → **Explore** → **Faro**
4. You should see events within 1-2 minutes!

#### Test Backend Monitoring

1. Visit: `https://cicd-whitefly-v2.onrender.com/metrics`
2. You should see Prometheus metrics
3. In Grafana: **Explore** → **Prometheus**
4. Query: `django_http_requests_total`

---

## 📊 Import Dashboards (Optional)

Pre-built dashboards are in `grafana-dashboards/`:

1. In Grafana, go to **Dashboards** → **Import**
2. Upload `frontend-dashboard.json`
3. Upload `backend-dashboard.json`
4. Done! 🎉

---

## 🔔 Set Up Alerts (Optional)

### Quick Alerts to Create:

1. **High Error Rate**
   - Condition: `rate(faro_errors_total[5m]) > 0.05`
   - Alert when: Error rate > 5% for 5 minutes

2. **Slow Backend**
   - Condition: `histogram_quantile(0.95, rate(django_http_request_duration_seconds_bucket[5m])) > 2`
   - Alert when: 95th percentile > 2 seconds

3. **Service Down**
   - Condition: `up{job="django"} == 0`
   - Alert when: No metrics for 2 minutes

### Add Notification Channel:

1. Go to **Alerting** → **Contact Points**
2. Add your email
3. Test it!

---

## 🎉 You're Done!

Your app is now monitored! You can see:

- ✅ Real-time performance metrics
- ✅ Error tracking with stack traces
- ✅ User behavior analytics
- ✅ API performance
- ✅ System health

---

## 📈 What You'll See

### Frontend Metrics
- Page load times
- JavaScript errors
- User sessions
- API call duration
- Browser/device distribution

### Backend Metrics
- Request rate
- Response times
- Error rates
- Database performance
- Image processing time

---

## 🆘 Troubleshooting

### No Frontend Data?

**Check:**
1. Environment variables are set in Vercel
2. App was redeployed after adding variables
3. Browser console for errors
4. Network tab for `/collect` requests

**Fix:**
```bash
# Redeploy frontend
cd frontend
npm run build
# Push to trigger Vercel deployment
```

### No Backend Data?

**Check:**
1. Visit `/metrics` endpoint - should show data
2. Check Render logs for errors
3. Verify `django-prometheus` is installed

**Fix:**
```bash
# SSH into Render or check logs
# Ensure requirements.txt has django-prometheus
pip install django-prometheus==2.3.1
```

---

## 💰 Costs

**Grafana Cloud Free Tier:**
- ✅ 10,000 metrics series
- ✅ 50 GB logs
- ✅ 14 days retention
- ✅ 3 users

**Perfect for your app!** No payment needed.

---

## 📚 Next Steps

1. **Explore Dashboards**: Check out the pre-built dashboards
2. **Set Up Alerts**: Get notified of issues
3. **Analyze Trends**: Look for performance patterns
4. **Optimize**: Use data to improve your app

---

## 🎓 Learn More

- [Grafana Faro Docs](https://grafana.com/docs/grafana-cloud/faro-web-sdk/)
- [Django Prometheus Docs](https://github.com/korfuri/django-prometheus)
- [PromQL Tutorial](https://prometheus.io/docs/prometheus/latest/querying/basics/)

---

## ✨ Pro Tips

1. **Check dashboards daily** - Spot issues early
2. **Set up alerts** - Get notified automatically
3. **Monitor after deployments** - Catch regressions
4. **Share with team** - Invite collaborators (free tier: 3 users)

---

**Happy Monitoring! 📊✨**

Your WhiteFly Detection app now has enterprise-grade observability! 🚀
