# 🖥️ Infrastructure Monitoring Setup

**Add CPU, Memory, Disk, and Network monitoring to Grafana**

---

## 🎯 What You'll Monitor

After this setup, you'll see in Grafana:

- **CPU Usage** - % utilization, load average
- **Memory Usage** - Used, available, swap
- **Disk Usage** - Space used, I/O operations
- **Network** - Bytes in/out, connections
- **System Load** - 1min, 5min, 15min averages

---

## 📊 Current Monitoring Status

✅ **Frontend** - Grafana Faro (user behavior, errors, performance)  
✅ **Backend API** - Django Prometheus (requests, response times)  
⚠️ **Infrastructure** - Not yet configured (CPU, memory, disk)

---

## 🚀 Quick Setup for Render

### **Option 1: Use Render Dashboard (Easiest - 2 min)**

Render provides built-in metrics:

1. Go to [dashboard.render.com](https://dashboard.render.com/)
2. Select your service: `cicd-whitefly-v2`
3. Click **"Metrics"** tab
4. View:
   - CPU usage
   - Memory usage
   - Network I/O
   - Instance count

**Pros:** No setup required  
**Cons:** Metrics stay in Render, not in Grafana

---

### **Option 2: Export to Grafana Cloud (Advanced - 30 min)**

To see everything in Grafana, you need to install **Grafana Agent**.

#### **Step 1: Get Grafana Cloud Prometheus Credentials**

1. Log into [Grafana Cloud](https://grafana.com)
2. Go to **"Connections"** → **"Add new connection"**
3. Search for **"Prometheus"**
4. Click **"Hosted Prometheus"**
5. You'll see:
   ```
   Remote Write URL: https://prometheus-xxx.grafana.net/api/prom/push
   Username: 123456
   Password/API Key: glc_xxx...
   ```
6. **Copy these credentials**

#### **Step 2: Add Environment Variables to Render**

1. Go to Render Dashboard → Your Service
2. **Environment** tab
3. Add these variables:

```env
GRAFANA_CLOUD_PROMETHEUS_URL=https://prometheus-xxx.grafana.net/api/prom/push
GRAFANA_CLOUD_PROMETHEUS_USER=123456
GRAFANA_CLOUD_API_KEY=glc_xxx...
```

#### **Step 3: Install Grafana Agent**

This is complex on Render's free tier because:
- No SSH access
- No persistent storage
- Limited control over system

**For Render, it's easier to use their built-in metrics.**

---

## 🎨 **Option 3: What You Can See NOW in Grafana**

Even without infrastructure monitoring, you already have valuable metrics:

### **Backend Metrics (Available Now)**

Go to Grafana → Explore → Prometheus and query:

#### **Request Rate:**
```promql
rate(django_http_requests_total[5m])
```

#### **Response Time (p95):**
```promql
histogram_quantile(0.95, rate(django_http_request_duration_seconds_bucket[5m]))
```

#### **Error Rate:**
```promql
rate(django_http_requests_total{status=~"5.."}[5m])
```

#### **Active Requests:**
```promql
django_http_requests_latency_seconds_by_view_method_count
```

#### **Database Query Time:**
```promql
rate(django_db_query_duration_seconds_sum[5m]) / rate(django_db_query_duration_seconds_count[5m])
```

### **Frontend Metrics (Available Now)**

Go to Grafana → Explore → Faro and see:

- Page load times
- JavaScript errors
- User sessions
- API call duration
- Browser distribution
- Custom events (uploads, detections)

---

## 📊 **Create a Dashboard with Current Metrics**

### **Import Pre-built Dashboards**

1. In Grafana, go to **Dashboards** → **Import**
2. Upload `grafana-dashboards/backend-dashboard.json`
3. Upload `grafana-dashboards/frontend-dashboard.json`

These dashboards show:
- Request rates
- Response times
- Error rates
- User activity
- Image processing metrics

---

## 🎯 **Recommended Approach**

### **For Now (Simple):**

1. **Use Render Dashboard** for CPU/memory
   - Go to Render → Metrics tab
   - View system resources

2. **Use Grafana** for application metrics
   - API performance
   - User behavior
   - Errors and issues

### **For Later (Advanced):**

When you upgrade to a paid Render plan or move to a VPS:
- Install Grafana Agent
- Export all metrics to Grafana
- Create unified dashboards

---

## 📈 **What You Can Monitor Right Now**

### **In Grafana (Application Level):**

| Metric | Query | What It Shows |
|--------|-------|---------------|
| Request Rate | `rate(django_http_requests_total[5m])` | Requests per second |
| Response Time | `histogram_quantile(0.95, ...)` | 95th percentile latency |
| Error Rate | `rate(django_http_requests_total{status=~"5.."}[5m])` | Server errors |
| Upload Rate | `rate(django_http_requests_total{view="upload_images_view"}[5m])` | Image uploads/sec |
| Page Load Time | Faro metrics | Frontend performance |
| Active Users | Faro sessions | Current users |

### **In Render Dashboard (Infrastructure Level):**

- CPU usage (%)
- Memory usage (MB)
- Network I/O (bytes)
- Request count

---

## 🔍 **View Your Metrics Now**

### **Step 1: Open Grafana Explore**

1. Go to Grafana Cloud
2. Click **"Explore"** (compass icon)
3. Select **"Prometheus"** as data source

### **Step 2: Try These Queries**

**Total Requests:**
```promql
sum(django_http_requests_total)
```

**Requests by Endpoint:**
```promql
sum by (view) (rate(django_http_requests_total[5m]))
```

**Average Response Time:**
```promql
rate(django_http_request_duration_seconds_sum[5m]) / 
rate(django_http_request_duration_seconds_count[5m])
```

**Image Processing Time:**
```promql
histogram_quantile(0.95, 
  rate(django_http_request_duration_seconds_bucket{view="upload_images_view"}[5m])
)
```

---

## 🎨 **Create a Custom Dashboard**

### **Step 1: Create New Dashboard**

1. In Grafana, click **"Dashboards"** → **"New Dashboard"**
2. Click **"Add visualization"**

### **Step 2: Add Panels**

**Panel 1: Request Rate**
- Query: `rate(django_http_requests_total[5m])`
- Visualization: Time series
- Title: "Request Rate"

**Panel 2: Response Time**
- Query: `histogram_quantile(0.95, rate(django_http_request_duration_seconds_bucket[5m]))`
- Visualization: Time series
- Title: "Response Time (p95)"

**Panel 3: Error Rate**
- Query: `rate(django_http_requests_total{status=~"5.."}[5m])`
- Visualization: Time series
- Title: "Error Rate"

**Panel 4: Active Requests**
- Query: `django_http_requests_latency_seconds_by_view_method_count`
- Visualization: Stat
- Title: "Active Requests"

### **Step 3: Save Dashboard**

1. Click **"Save dashboard"** (disk icon)
2. Name: "WhiteFly Application Monitoring"
3. Click **"Save"**

---

## 💡 **Pro Tips**

### **For CPU/Memory Monitoring:**

**Option A:** Check Render Dashboard regularly  
**Option B:** Set up alerts in Render for high usage  
**Option C:** Upgrade to paid plan for more metrics

### **For Application Monitoring:**

**Use Grafana for:**
- API performance trends
- Error tracking
- User behavior analysis
- Business metrics (uploads, detections)

**Use Render for:**
- System resource usage
- Infrastructure health
- Deployment status

---

## 🚨 **Set Up Alerts**

Even without CPU metrics in Grafana, you can alert on:

### **High Response Time:**
```promql
histogram_quantile(0.95, rate(django_http_request_duration_seconds_bucket[5m])) > 2
```
Alert when: Response time > 2 seconds for 5 minutes

### **High Error Rate:**
```promql
rate(django_http_requests_total{status=~"5.."}[5m]) > 0.05
```
Alert when: Error rate > 5% for 5 minutes

### **No Requests (Service Down):**
```promql
rate(django_http_requests_total[5m]) == 0
```
Alert when: No requests for 2 minutes

---

## 📚 **Summary**

### **What You Have Now:**
✅ Application metrics (API, frontend)  
✅ User behavior tracking  
✅ Error monitoring  
✅ Performance metrics

### **What You Don't Have:**
❌ CPU usage in Grafana  
❌ Memory usage in Grafana  
❌ Disk usage in Grafana

### **Solution:**
- **Short-term:** Use Render Dashboard for infrastructure
- **Long-term:** Upgrade or migrate to get full control

---

## 🎯 **Next Steps**

1. **Import the pre-built dashboards** (backend-dashboard.json, frontend-dashboard.json)
2. **Check Render Dashboard** for CPU/memory
3. **Use Grafana Explore** to query your metrics
4. **Create custom dashboards** for your specific needs
5. **Set up alerts** for critical issues

---

**You already have 80% of what you need! The remaining 20% (infrastructure metrics) requires either a paid Render plan or a different hosting solution.** 🚀

For now, focus on the application-level metrics you already have - they're the most valuable for improving your app! 📊
