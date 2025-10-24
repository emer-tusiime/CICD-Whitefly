# ✅ Deployment Checklist - Grafana Monitoring

Use this checklist to ensure monitoring is properly set up.

---

## 📋 Pre-Deployment

### Code Changes
- [x] Frontend monitoring utility created (`src/utils/monitoring.js`)
- [x] Monitoring initialized in `main.jsx`
- [x] User tracking added to `AuthContext.jsx`
- [x] Event tracking added to `Dashboard.jsx`
- [x] Backend Prometheus dependencies added to `requirements.txt`
- [x] Django settings updated with `django_prometheus`
- [x] Prometheus middleware configured
- [x] Metrics endpoint added to `urls.py`

### Files Created
- [x] `GRAFANA_MONITORING_SETUP.md` - Complete setup guide
- [x] `GRAFANA_QUICK_START.md` - Quick start guide
- [x] `.env.monitoring.example` - Environment variable template
- [x] `grafana-dashboards/frontend-dashboard.json` - Frontend dashboard
- [x] `grafana-dashboards/backend-dashboard.json` - Backend dashboard
- [x] `DEPLOYMENT_CHECKLIST.md` - This file

---

## 🌐 Grafana Cloud Setup

### Account Creation
- [ ] Created Grafana Cloud account at [grafana.com](https://grafana.com)
- [ ] Verified email address
- [ ] Logged into Grafana Cloud
- [ ] Noted down Grafana URL: `https://__________.grafana.net`

### Faro Application Setup
- [ ] Created Faro application in Grafana Cloud
- [ ] Application name: `WhiteFly Frontend`
- [ ] Copied Faro App ID: `__________`
- [ ] Copied Faro Collector URL: `https://faro-collector-__________.grafana.net/collect`

---

## 🚀 Frontend Deployment (Vercel)

### Environment Variables
- [ ] Logged into Vercel Dashboard
- [ ] Selected project: `cicd-whitefly-2ee8`
- [ ] Navigated to Settings → Environment Variables
- [ ] Added `VITE_GRAFANA_FARO_URL`
- [ ] Added `VITE_GRAFANA_FARO_APP_ID`
- [ ] Added `VITE_GRAFANA_FARO_APP_NAME`
- [ ] Added `VITE_GRAFANA_FARO_ENV`
- [ ] Saved all variables

### Deployment
- [ ] Triggered new deployment (or pushed to GitHub)
- [ ] Deployment succeeded
- [ ] Visited app URL: `https://cicd-whitefly-2ee8.vercel.app`
- [ ] Checked browser console - no Faro errors
- [ ] Checked Network tab - `/collect` requests visible

---

## 🔧 Backend Deployment (Render)

### Environment Variables
- [ ] Logged into Render Dashboard
- [ ] Selected service: `whitefly-backend`
- [ ] Navigated to Environment tab
- [ ] Added `ENABLE_METRICS=True`
- [ ] Saved changes

### Deployment
- [ ] Render auto-deployed after environment change
- [ ] Deployment succeeded
- [ ] Visited metrics endpoint: `https://cicd-whitefly-v2.onrender.com/metrics`
- [ ] Verified Prometheus metrics are visible
- [ ] Checked for `django_http_requests_total` metric

---

## 🧪 Testing

### Frontend Monitoring
- [ ] Opened app in browser
- [ ] Logged in with test account
- [ ] Uploaded test image
- [ ] Navigated between pages
- [ ] Checked Grafana Cloud → Explore → Faro
- [ ] Verified events are appearing (wait 1-2 minutes)
- [ ] Checked for:
  - [ ] Page views
  - [ ] User sessions
  - [ ] Custom events (image_upload, detection_completed)
  - [ ] Navigation events

### Backend Monitoring
- [ ] Visited `/metrics` endpoint
- [ ] Copied a metric name (e.g., `django_http_requests_total`)
- [ ] Went to Grafana Cloud → Explore → Prometheus
- [ ] Ran query: `django_http_requests_total`
- [ ] Verified data is appearing
- [ ] Checked for:
  - [ ] HTTP request metrics
  - [ ] Response time metrics
  - [ ] Database query metrics

---

## 📊 Dashboard Setup

### Import Dashboards
- [ ] In Grafana, navigated to Dashboards → Import
- [ ] Imported `grafana-dashboards/frontend-dashboard.json`
- [ ] Verified frontend dashboard displays data
- [ ] Imported `grafana-dashboards/backend-dashboard.json`
- [ ] Verified backend dashboard displays data

### Customize Dashboards
- [ ] Adjusted time ranges if needed
- [ ] Pinned important panels
- [ ] Set refresh interval (default: 30s)
- [ ] Saved dashboard changes

---

## 🔔 Alerting Setup

### Create Alert Rules
- [ ] Navigated to Alerting → Alert Rules
- [ ] Created alert: "High Frontend Error Rate"
  - [ ] Condition: `rate(faro_errors_total[5m]) > 0.05`
  - [ ] Threshold: 5% error rate for 5 minutes
- [ ] Created alert: "Slow Backend Response"
  - [ ] Condition: `histogram_quantile(0.95, rate(django_http_request_duration_seconds_bucket[5m])) > 2`
  - [ ] Threshold: p95 > 2 seconds for 5 minutes
- [ ] Created alert: "Backend Service Down"
  - [ ] Condition: No metrics received for 2 minutes

### Configure Notifications
- [ ] Navigated to Alerting → Contact Points
- [ ] Added email notification: `__________@__________.com`
- [ ] Tested email notification
- [ ] (Optional) Added Slack webhook
- [ ] (Optional) Added Discord webhook

---

## 🔍 Verification

### Final Checks
- [ ] All dashboards loading correctly
- [ ] Real-time data flowing from frontend
- [ ] Real-time data flowing from backend
- [ ] Alerts configured and tested
- [ ] Notification channels working
- [ ] Team members invited (if applicable)

### Performance Check
- [ ] Page load times within acceptable range
- [ ] No significant performance impact from monitoring
- [ ] Faro bundle size acceptable (~10KB)
- [ ] Backend `/metrics` endpoint responding quickly

---

## 📝 Documentation

### Update Documentation
- [ ] Added monitoring section to README.md
- [ ] Documented environment variables
- [ ] Created runbook for common issues
- [ ] Shared Grafana credentials with team (securely)

### Team Training
- [ ] Showed team how to access Grafana
- [ ] Explained key metrics to watch
- [ ] Demonstrated how to investigate issues
- [ ] Shared alert notification channels

---

## 🎉 Post-Deployment

### Monitor for Issues
- [ ] Day 1: Check dashboards hourly
- [ ] Day 2-7: Check dashboards daily
- [ ] Week 2+: Check dashboards as needed

### Optimization
- [ ] Review alert thresholds after 1 week
- [ ] Adjust sampling rate if needed (high traffic)
- [ ] Add custom metrics for business KPIs
- [ ] Create additional dashboards as needed

### Maintenance
- [ ] Set calendar reminder to review metrics weekly
- [ ] Plan to rotate API keys quarterly
- [ ] Monitor Grafana Cloud usage (stay within free tier)
- [ ] Update dashboards based on new features

---

## 🆘 Rollback Plan

If monitoring causes issues:

### Frontend Rollback
1. Remove Faro environment variables from Vercel
2. Redeploy frontend
3. Monitoring will be disabled (app still works)

### Backend Rollback
1. Remove `django_prometheus` from `INSTALLED_APPS`
2. Remove Prometheus middleware from `MIDDLEWARE`
3. Redeploy backend
4. Metrics endpoint will return 404 (app still works)

---

## ✅ Sign-Off

- [ ] Monitoring fully operational
- [ ] All team members have access
- [ ] Documentation complete
- [ ] Alerts configured
- [ ] Runbook created

**Deployed by:** _________________  
**Date:** _________________  
**Verified by:** _________________  
**Date:** _________________  

---

## 📞 Support Contacts

- **Grafana Cloud Support**: [grafana.com/support](https://grafana.com/support)
- **Team Lead**: _________________
- **DevOps Contact**: _________________

---

**Congratulations! Your WhiteFly Detection app is now fully monitored! 🎉📊**
