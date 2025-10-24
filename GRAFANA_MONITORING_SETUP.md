# 📊 Grafana Monitoring Setup Guide

Complete guide to monitor your WhiteFly Detection application using Grafana Cloud.

---

## 🎯 Overview

This guide will help you set up comprehensive monitoring for:
- **Frontend**: React app performance, errors, user interactions (Grafana Faro)
- **Backend**: Django API metrics, request rates, errors (Prometheus + Grafana)
- **Infrastructure**: Server health, resource usage (Render metrics)

---

## 📋 Prerequisites

- ✅ Application deployed on Vercel (Frontend) and Render (Backend)
- ✅ Grafana Faro SDK already installed in `package.json`
- ⚠️ Need: Grafana Cloud account (free tier available)

---

## 🚀 Step 1: Create Grafana Cloud Account

### 1.1 Sign Up for Grafana Cloud
1. Go to [grafana.com](https://grafana.com/auth/sign-up/create-user)
2. Sign up for a **free account** (no credit card required)
3. Choose a stack name (e.g., `whitefly-monitoring`)
4. Select region closest to your users

### 1.2 Get Your Credentials
After account creation, you'll receive:
- **Grafana URL**: `https://your-stack.grafana.net`
- **Username**: Your email
- **Password**: Set during signup

---

## 🎨 Step 2: Set Up Frontend Monitoring (Grafana Faro)

### 2.1 Get Faro Application Credentials

1. Log into Grafana Cloud
2. Navigate to **Frontend Observability** → **Faro**
3. Click **"Create Application"**
4. Fill in:
   - **Name**: `WhiteFly Frontend`
   - **Description**: `React frontend monitoring`
5. Click **Create**
6. Copy the generated credentials:
   - **App ID**: `your-app-id`
   - **Endpoint URL**: `https://faro-collector-xxx.grafana.net/collect`

### 2.2 Configure Faro in React App

The configuration files have been created for you. You'll need to add your Faro credentials as environment variables.

---

## 🔧 Step 3: Set Up Backend Monitoring (Django + Prometheus)

### 3.1 Install Django Prometheus

Backend dependencies will be added to `requirements.txt`:
- `django-prometheus` - Django metrics exporter
- `prometheus-client` - Prometheus Python client

### 3.2 Configure Prometheus Endpoint

Django will expose metrics at `/metrics` endpoint that Grafana can scrape.

---

## 🌐 Step 4: Environment Variables

### 4.1 Vercel Environment Variables (Frontend)

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add these variables:

```env
VITE_GRAFANA_FARO_URL=https://faro-collector-xxx.grafana.net/collect
VITE_GRAFANA_FARO_APP_ID=your-app-id
VITE_GRAFANA_FARO_APP_NAME=WhiteFly Frontend
VITE_GRAFANA_FARO_ENV=production
```

### 4.2 Render Environment Variables (Backend)

Go to Render Dashboard → Your Service → Environment

Add these variables:

```env
GRAFANA_CLOUD_URL=https://your-stack.grafana.net
GRAFANA_CLOUD_API_KEY=your-api-key
ENABLE_METRICS=True
```

---

## 📊 Step 5: Create Grafana Dashboards

### 5.1 Frontend Dashboard

1. In Grafana Cloud, go to **Dashboards** → **New Dashboard**
2. Import the dashboard JSON (provided in `grafana-dashboards/frontend-dashboard.json`)
3. Or create manually with these panels:
   - **Page Load Time** (avg, p95, p99)
   - **Error Rate** (errors per minute)
   - **User Sessions** (active users)
   - **API Request Duration** (by endpoint)
   - **Browser Distribution**
   - **Geographic Distribution**

### 5.2 Backend Dashboard

1. Create new dashboard
2. Import `grafana-dashboards/backend-dashboard.json`
3. Key panels:
   - **Request Rate** (requests per second)
   - **Response Time** (avg, p95, p99)
   - **Error Rate** (4xx, 5xx errors)
   - **Database Query Time**
   - **Active Users**
   - **Image Processing Time**

---

## 🔔 Step 6: Set Up Alerts

### 6.1 Frontend Alerts

Create alerts for:
- **High Error Rate**: > 5% error rate for 5 minutes
- **Slow Page Load**: > 3 seconds average for 5 minutes
- **API Failures**: > 10 failed requests in 1 minute

### 6.2 Backend Alerts

Create alerts for:
- **High Response Time**: > 2 seconds average for 5 minutes
- **Error Rate**: > 5% 5xx errors for 5 minutes
- **Server Down**: No metrics received for 2 minutes
- **High Memory Usage**: > 90% for 5 minutes

### 6.3 Configure Notification Channels

1. Go to **Alerting** → **Contact Points**
2. Add notification channels:
   - **Email**: Your email address
   - **Slack** (optional): Slack webhook URL
   - **Discord** (optional): Discord webhook URL

---

## 📈 Step 7: What You'll Monitor

### Frontend Metrics (Grafana Faro)
- ✅ **Performance**:
  - Page load time
  - Time to first byte (TTFB)
  - First contentful paint (FCP)
  - Largest contentful paint (LCP)
  - Cumulative layout shift (CLS)

- ✅ **Errors**:
  - JavaScript errors
  - Network errors
  - API failures
  - Stack traces

- ✅ **User Behavior**:
  - Page views
  - User sessions
  - Click events
  - Navigation patterns

- ✅ **API Calls**:
  - Request duration
  - Success/failure rates
  - Endpoint usage

### Backend Metrics (Django Prometheus)
- ✅ **HTTP Metrics**:
  - Request count by method/endpoint
  - Response time by endpoint
  - Status code distribution
  - Request size/response size

- ✅ **Django Metrics**:
  - Database query count
  - Database query duration
  - Cache hit/miss ratio
  - Model operations

- ✅ **Application Metrics**:
  - Active users
  - Image uploads per minute
  - Detection processing time
  - CSV exports

- ✅ **System Metrics**:
  - CPU usage
  - Memory usage
  - Disk I/O
  - Network I/O

---

## 🧪 Step 8: Testing Your Setup

### 8.1 Test Frontend Monitoring

1. Open your app: `https://cicd-whitefly-2ee8.vercel.app`
2. Perform actions:
   - Login
   - Upload images
   - Navigate between pages
   - Trigger an error (optional)

3. Check Grafana:
   - Go to **Explore** → **Faro**
   - You should see events within 1-2 minutes

### 8.2 Test Backend Monitoring

1. Visit metrics endpoint: `https://cicd-whitefly-v2.onrender.com/metrics`
2. You should see Prometheus metrics
3. In Grafana:
   - Go to **Explore** → **Prometheus**
   - Query: `django_http_requests_total`

---

## 📊 Step 9: Sample Queries

### Frontend (Faro) Queries

**Average Page Load Time**:
```promql
avg(faro_page_load_time_seconds)
```

**Error Rate**:
```promql
rate(faro_errors_total[5m])
```

**Active Users**:
```promql
count(count by (session_id) (faro_page_views_total))
```

### Backend (Prometheus) Queries

**Request Rate**:
```promql
rate(django_http_requests_total[5m])
```

**Average Response Time**:
```promql
rate(django_http_request_duration_seconds_sum[5m]) / 
rate(django_http_request_duration_seconds_count[5m])
```

**Error Rate**:
```promql
rate(django_http_requests_total{status=~"5.."}[5m])
```

**Image Upload Rate**:
```promql
rate(django_http_requests_total{method="POST", view="upload"}[5m])
```

---

## 🎯 Step 10: Best Practices

### 10.1 Data Retention
- **Free Tier**: 14 days of metrics retention
- **Paid Tier**: Longer retention available
- Export important data regularly

### 10.2 Sampling
- Use sampling for high-traffic apps
- Configure in Faro: `sessionSampleRate: 0.1` (10%)

### 10.3 Privacy
- Don't log sensitive data (passwords, tokens)
- Mask PII in error messages
- Configure `beforeSend` hook to sanitize data

### 10.4 Performance
- Faro is lightweight (~10KB gzipped)
- Minimal performance impact
- Batches events before sending

---

## 🔍 Troubleshooting

### Frontend Issues

**No data in Grafana Faro**:
- Check browser console for errors
- Verify Faro URL and App ID
- Check network tab for `/collect` requests
- Ensure environment variables are set in Vercel

**CORS errors**:
- Faro collector should handle CORS automatically
- If issues persist, check Grafana Cloud settings

### Backend Issues

**Metrics endpoint not working**:
- Check if `django-prometheus` is installed
- Verify middleware is configured
- Check Render logs for errors

**No data in Grafana**:
- Verify Prometheus scrape config
- Check if metrics endpoint is accessible
- Ensure Grafana Cloud can reach your backend

---

## 💰 Costs

### Grafana Cloud Free Tier
- ✅ **Metrics**: 10,000 series
- ✅ **Logs**: 50 GB
- ✅ **Traces**: 50 GB
- ✅ **Users**: 3 users
- ✅ **Retention**: 14 days

**This is sufficient for your application!**

### Paid Tiers (Optional)
- **Pro**: $49/month - More metrics, longer retention
- **Advanced**: $299/month - Enterprise features

---

## 📚 Additional Resources

- [Grafana Faro Documentation](https://grafana.com/docs/grafana-cloud/faro-web-sdk/)
- [Django Prometheus Documentation](https://github.com/korfuri/django-prometheus)
- [Grafana Cloud Documentation](https://grafana.com/docs/grafana-cloud/)
- [PromQL Query Language](https://prometheus.io/docs/prometheus/latest/querying/basics/)

---

## 🎉 Next Steps

After setup, you'll have:
- ✅ Real-time application monitoring
- ✅ Error tracking and alerting
- ✅ Performance insights
- ✅ User behavior analytics
- ✅ Infrastructure metrics

**Your WhiteFly Detection app will be production-ready with enterprise-grade monitoring!** 🚀

---

## 📞 Support

If you encounter issues:
1. Check Grafana Cloud status page
2. Review application logs (Vercel/Render)
3. Check Grafana Community forums
4. Contact Grafana support (paid tiers)

**Happy Monitoring!** 📊✨
