# 📊 WhiteFly Detection - Grafana Monitoring

**Complete monitoring solution for your deployed application**

---

## 🎯 Overview

Your WhiteFly Detection application is now equipped with **enterprise-grade monitoring** using Grafana Cloud. This setup provides:

- **Frontend Monitoring** (Grafana Faro) - React app performance and user behavior
- **Backend Monitoring** (Prometheus) - Django API metrics and system health
- **Real-time Dashboards** - Visual insights into your application
- **Alerting** - Get notified of issues before users complain

---

## 📁 Files Added

### Configuration Files
```
frontend/src/utils/monitoring.js          # Grafana Faro configuration
.env.monitoring.example                    # Environment variable template
```

### Documentation
```
GRAFANA_MONITORING_SETUP.md               # Complete setup guide (detailed)
GRAFANA_QUICK_START.md                    # Quick start guide (15 minutes)
DEPLOYMENT_CHECKLIST.md                   # Deployment verification checklist
MONITORING_README.md                      # This file
```

### Dashboards
```
grafana-dashboards/
├── frontend-dashboard.json               # React app monitoring dashboard
└── backend-dashboard.json                # Django API monitoring dashboard
```

### Code Changes
```
frontend/src/main.jsx                     # Initialize monitoring
frontend/src/context/AuthContext.jsx      # Track user login/logout
frontend/src/components/Dashboard.jsx     # Track events (uploads, navigation)
backend/requirements.txt                  # Added django-prometheus
backend/Whitefly_web/settings.py          # Configured Prometheus
backend/Whitefly_web/urls.py              # Added /metrics endpoint
```

---

## 🚀 Quick Start

### For the Impatient (15 minutes)

1. **Create Grafana Cloud account** → [grafana.com/signup](https://grafana.com/auth/sign-up/create-user)
2. **Get Faro credentials** → Frontend Observability → Create Application
3. **Add to Vercel** → Environment Variables:
   ```
   VITE_GRAFANA_FARO_URL=https://faro-collector-xxx.grafana.net/collect
   VITE_GRAFANA_FARO_APP_ID=your-app-id
   ```
4. **Add to Render** → Environment:
   ```
   ENABLE_METRICS=True
   ```
5. **Redeploy** both services
6. **Done!** Check Grafana Cloud → Explore

📖 **Full guide**: See `GRAFANA_QUICK_START.md`

---

## 📊 What You'll Monitor

### Frontend Metrics (Grafana Faro)

| Metric | Description | Why It Matters |
|--------|-------------|----------------|
| **Page Load Time** | How fast pages load | User experience |
| **Error Rate** | JavaScript errors | Application stability |
| **API Duration** | Backend call speed | Performance bottlenecks |
| **User Sessions** | Active users | Usage patterns |
| **Custom Events** | Uploads, detections | Business metrics |

### Backend Metrics (Prometheus)

| Metric | Description | Why It Matters |
|--------|-------------|----------------|
| **Request Rate** | Requests per second | Traffic patterns |
| **Response Time** | API latency | Performance |
| **Error Rate** | 4xx/5xx errors | Application health |
| **DB Query Time** | Database performance | Optimization opportunities |
| **Processing Time** | Image detection speed | Core functionality |

---

## 🎨 Dashboards

### Frontend Dashboard
- Page load performance (p95, p99, avg)
- Error tracking and distribution
- Active users and sessions
- API request duration by endpoint
- Browser/device distribution
- Top errors with stack traces
- Custom events (uploads, detections)

### Backend Dashboard
- Request rate by endpoint
- Response time percentiles
- Status code distribution
- Database query performance
- Image processing metrics
- Slowest endpoints
- Error rates and trends

---

## 🔔 Recommended Alerts

### Critical Alerts
1. **Backend Down** - No metrics for 2 minutes
2. **High Error Rate** - >5% errors for 5 minutes
3. **Slow Response** - p95 >2 seconds for 5 minutes

### Warning Alerts
1. **Increased Error Rate** - >2% errors for 10 minutes
2. **Slow Page Load** - >3 seconds average for 5 minutes
3. **High Memory Usage** - >80% for 10 minutes

---

## 🛠️ Setup Instructions

### Choose Your Path

#### 🏃 Quick Setup (15 min)
→ Follow `GRAFANA_QUICK_START.md`

#### 📚 Detailed Setup (30 min)
→ Follow `GRAFANA_MONITORING_SETUP.md`

#### ✅ Verification
→ Use `DEPLOYMENT_CHECKLIST.md`

---

## 🔧 Environment Variables

### Frontend (Vercel)
```env
VITE_GRAFANA_FARO_URL=https://faro-collector-xxx.grafana.net/collect
VITE_GRAFANA_FARO_APP_ID=your-app-id
VITE_GRAFANA_FARO_APP_NAME=WhiteFly Frontend
VITE_GRAFANA_FARO_ENV=production
VITE_FARO_SAMPLE_RATE=1.0  # Optional: 1.0 = 100%
```

### Backend (Render)
```env
ENABLE_METRICS=True
```

📝 **Template**: See `.env.monitoring.example`

---

## 📈 Accessing Your Dashboards

### Grafana Cloud URLs

**Main Dashboard**: `https://your-stack.grafana.net`

**Frontend Monitoring**:
- Explore → Faro → Select "WhiteFly Frontend"
- Dashboards → Import `frontend-dashboard.json`

**Backend Monitoring**:
- Explore → Prometheus → Query: `django_http_requests_total`
- Dashboards → Import `backend-dashboard.json`

**Metrics Endpoint**: `https://cicd-whitefly-v2.onrender.com/metrics`

---

## 🧪 Testing

### Verify Frontend Monitoring
```bash
# 1. Open your app
https://cicd-whitefly-2ee8.vercel.app

# 2. Perform actions
- Login
- Upload images
- Navigate pages

# 3. Check Grafana (wait 1-2 min)
Explore → Faro → See events
```

### Verify Backend Monitoring
```bash
# 1. Check metrics endpoint
curl https://cicd-whitefly-v2.onrender.com/metrics

# 2. Query in Grafana
Explore → Prometheus
Query: django_http_requests_total
```

---

## 🎓 Learning Resources

### Grafana Faro
- [Official Docs](https://grafana.com/docs/grafana-cloud/faro-web-sdk/)
- [Web Vitals Guide](https://web.dev/vitals/)
- [Error Tracking Best Practices](https://grafana.com/docs/grafana-cloud/faro-web-sdk/error-tracking/)

### Django Prometheus
- [GitHub Repo](https://github.com/korfuri/django-prometheus)
- [Prometheus Docs](https://prometheus.io/docs/)
- [PromQL Tutorial](https://prometheus.io/docs/prometheus/latest/querying/basics/)

### Grafana Dashboards
- [Dashboard Best Practices](https://grafana.com/docs/grafana/latest/dashboards/build-dashboards/best-practices/)
- [Panel Types Guide](https://grafana.com/docs/grafana/latest/panels-visualizations/)

---

## 💰 Costs

### Grafana Cloud Free Tier
- ✅ **10,000 metrics series** - More than enough
- ✅ **50 GB logs** - Plenty of space
- ✅ **14 days retention** - Good for analysis
- ✅ **3 users** - Share with team
- ✅ **Unlimited dashboards** - Create as many as needed

**Total Cost: $0/month** 🎉

### When to Upgrade
- High traffic (>100k requests/day)
- Need longer retention (>14 days)
- More team members (>3 users)
- Advanced features (SLOs, on-call)

---

## 🐛 Troubleshooting

### No Frontend Data?

**Checklist:**
- [ ] Environment variables set in Vercel?
- [ ] App redeployed after adding variables?
- [ ] Browser console shows no Faro errors?
- [ ] Network tab shows `/collect` requests?

**Solution:**
```bash
# Redeploy frontend
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

### No Backend Data?

**Checklist:**
- [ ] `/metrics` endpoint accessible?
- [ ] `django-prometheus` in requirements.txt?
- [ ] Middleware configured in settings.py?
- [ ] Render deployment successful?

**Solution:**
```bash
# Check Render logs
# Verify django-prometheus is installed
# Ensure ENABLE_METRICS=True in environment
```

### Metrics Not Updating?

**Common Issues:**
- Grafana query time range too narrow
- Data source not connected
- Sampling rate too low
- Application not generating traffic

**Fix:**
- Extend time range to "Last 6 hours"
- Verify data source in Grafana settings
- Generate test traffic to your app

---

## 🔐 Security Notes

### Best Practices
- ✅ Never commit API keys to Git
- ✅ Use environment variables for secrets
- ✅ Rotate keys quarterly
- ✅ Use different keys for dev/prod
- ✅ Sanitize sensitive data before logging

### Data Privacy
- User IDs are hashed
- Passwords are never logged
- API keys are masked in errors
- PII is filtered in `beforeSend` hook

---

## 🎯 Next Steps

### Immediate (Today)
1. ✅ Complete setup using Quick Start guide
2. ✅ Verify data is flowing
3. ✅ Import dashboards
4. ✅ Test alerts

### Short-term (This Week)
1. Create custom dashboards for your needs
2. Set up notification channels (Slack, email)
3. Define SLOs (Service Level Objectives)
4. Train team on using Grafana

### Long-term (This Month)
1. Analyze trends and optimize performance
2. Create runbooks for common issues
3. Set up synthetic monitoring
4. Implement custom business metrics

---

## 📞 Support

### Documentation
- `GRAFANA_MONITORING_SETUP.md` - Detailed setup
- `GRAFANA_QUICK_START.md` - Quick setup
- `DEPLOYMENT_CHECKLIST.md` - Verification

### External Resources
- [Grafana Community](https://community.grafana.com/)
- [Grafana Support](https://grafana.com/support/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/grafana)

### Team Contacts
- DevOps Lead: _________________
- On-Call Engineer: _________________

---

## ✨ Success Metrics

After setup, you should achieve:

- ✅ **<1 second** page load time (p95)
- ✅ **<0.1%** error rate
- ✅ **<500ms** API response time (p95)
- ✅ **100%** uptime monitoring
- ✅ **<5 min** alert response time

---

## 🎉 Congratulations!

Your WhiteFly Detection application now has:

- 📊 **Real-time monitoring**
- 🔍 **Error tracking**
- 📈 **Performance insights**
- 🔔 **Proactive alerting**
- 📉 **Trend analysis**

**You're now running a production-grade, enterprise-level application!** 🚀

---

**Questions?** Check the detailed guides or create an issue in the repository.

**Happy Monitoring!** 📊✨
