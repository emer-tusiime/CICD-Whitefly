# 🔧 CORS Error Fix - Grafana Faro Tracing Headers

## ❌ The Error

```
Access to XMLHttpRequest at 'https://cicd-whitefly-v2.onrender.com/api/auth/signup/' 
from origin 'https://cicd-whitefly-2ee8.vercel.app' has been blocked by CORS policy: 
Request header field traceparent is not allowed by Access-Control-Allow-Headers 
in preflight response.
```

## 🔍 Root Cause

Grafana Faro's **TracingInstrumentation** adds distributed tracing headers:
- `traceparent` - Trace context propagation
- `tracestate` - Additional trace state

Django's CORS middleware doesn't allow these headers by default, causing signup/login to fail.

## ✅ Solution Applied

Updated `backend/Whitefly_web/settings.py`:

1. **Added import:**
   ```python
   from corsheaders.defaults import default_headers
   ```

2. **Added CORS header configuration:**
   ```python
   CORS_ALLOW_HEADERS = list(default_headers) + [
       'traceparent',
       'tracestate',
   ]
   ```

This allows Grafana Faro to send tracing headers while maintaining security.

## 🚀 Deploy the Fix

### **Step 1: Commit Changes**
```bash
cd "C:\Users\emert\Music\Whitefly detection"
git add backend/Whitefly_web/settings.py
git commit -m "Fix CORS error: Allow Grafana Faro tracing headers"
git push origin main
```

### **Step 2: Wait for Render to Deploy**
- Render will auto-deploy (takes 2-3 minutes)
- Check deployment status at [dashboard.render.com](https://dashboard.render.com/)

### **Step 3: Test Signup**
1. Go to `https://cicd-whitefly-2ee8.vercel.app`
2. Try to create an account
3. Should work now! ✅

## 🧪 Verify the Fix

### **Check Browser Console:**
1. Open DevTools (F12)
2. Go to **Network** tab
3. Try signup
4. Look for `/api/auth/signup/` request
5. Should show **201 Created** (not CORS error)

### **Check Request Headers:**
In Network tab, click on the signup request and look for:
- `traceparent: 00-xxxxx-xxxxx-01` ✅
- `tracestate: ...` ✅

These headers are now allowed!

## 📊 What This Enables

With tracing headers allowed, Grafana Faro can now:
- ✅ Track end-to-end request flow
- ✅ Correlate frontend actions with backend API calls
- ✅ Measure full request duration (frontend → backend → response)
- ✅ Debug performance issues across the stack

## 🔒 Security Note

This change is **safe** because:
- Only adds specific tracing headers
- Doesn't expose sensitive data
- Maintains all other CORS restrictions
- Standard practice for distributed tracing

## 🎯 Alternative Solutions (if needed)

### **Option 1: Disable Tracing (Not Recommended)**

If you want to disable tracing temporarily, update `frontend/src/utils/monitoring.js`:

```javascript
instrumentations: [
    ...getWebInstrumentations(),
    // Comment out tracing:
    // new TracingInstrumentation(),
],
```

**Cons:** Lose end-to-end visibility

### **Option 2: More Permissive CORS (Not Recommended)**

```python
CORS_ALLOW_HEADERS = ['*']  # Allow all headers
```

**Cons:** Less secure, not best practice

## ✅ Recommended Approach

**Keep the fix as implemented** - it's secure and enables full monitoring capabilities.

## 🆘 If Still Not Working

### **Check 1: Deployment Status**
```bash
# Verify Render deployed successfully
# Check logs at dashboard.render.com
```

### **Check 2: Clear Browser Cache**
```
Ctrl + Shift + Delete → Clear cache
Or use Incognito mode
```

### **Check 3: Verify Settings**
```bash
# In backend/Whitefly_web/settings.py, confirm:
from corsheaders.defaults import default_headers

CORS_ALLOW_HEADERS = list(default_headers) + [
    'traceparent',
    'tracestate',
]
```

### **Check 4: Django CORS Headers Version**
```bash
# In backend/requirements.txt, should have:
django-cors-headers==4.9.0
```

## 📚 Related Documentation

- [CORS Headers Documentation](https://github.com/adamchainz/django-cors-headers)
- [W3C Trace Context](https://www.w3.org/TR/trace-context/)
- [Grafana Faro Tracing](https://grafana.com/docs/grafana-cloud/faro-web-sdk/tracing/)

## 🎉 Summary

**Problem:** Grafana Faro tracing headers blocked by CORS  
**Solution:** Allow `traceparent` and `tracestate` headers  
**Status:** ✅ Fixed  
**Action:** Push to GitHub and wait for Render deployment

---

**After deployment, your signup/login should work perfectly!** 🚀
