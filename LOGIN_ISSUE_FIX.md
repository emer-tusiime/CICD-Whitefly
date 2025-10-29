# 🔐 Login After Logout Issue - Diagnosis & Fix

## ❌ The Problem

**Symptom:** After creating an account, logging in works. But after logout, trying to login again with the same credentials fails.

## 🔍 Possible Causes

### **1. CSRF Token Not Refreshed After Logout (Most Likely)**
- After logout, the CSRF token becomes stale
- Next login attempt uses old token
- Django rejects the request

### **2. Session Cookie Not Cleared Properly**
- Old session cookie remains
- Conflicts with new login attempt

### **3. Browser Cache Issues**
- Cached authentication state
- Stale cookies

### **4. Password Not Saved Correctly (Unlikely)**
- Password not hashed during signup
- But your code uses `create_user()` which is correct

## 🧪 **Quick Test: Which Issue Do You Have?**

### **Test 1: Check Browser Console**

1. Open your app: `https://cicd-whitefly-2ee8.vercel.app`
2. Open DevTools (F12) → **Console** tab
3. Try to login after logout
4. Look for errors

**If you see:**
- `403 Forbidden` → CSRF token issue
- `401 Unauthorized` → Wrong credentials or password issue
- `CORS error` → Backend CORS issue (already fixed)
- `Network error` → Backend down

### **Test 2: Check Network Tab**

1. Open DevTools → **Network** tab
2. Try login after logout
3. Click on `/auth/login/` request
4. Check **Response** tab

**If you see:**
- `"error": "Invalid credentials"` → Password not matching
- `"error": "CSRF Failed"` → CSRF token issue
- `"detail": "Authentication credentials were not provided"` → Session issue

### **Test 3: Try Incognito Mode**

1. Open Incognito/Private window
2. Go to your app
3. Login with existing account
4. Does it work?

**If YES:** Browser cache/cookie issue  
**If NO:** Backend issue

## ✅ **Solution 1: Refresh CSRF Token After Logout**

Update `frontend/src/context/AuthContext.jsx`:

```javascript
const logout = async () => {
  try {
    await api.post('/auth/logout/');
    setUser(null);
    clearMonitoringUser();
    
    // IMPORTANT: Get fresh CSRF token after logout
    await api.get('/csrf/');
    console.log('Fresh CSRF token obtained after logout');
  } catch (error) {
    console.error('Logout error:', error);
    // Still clear user even if logout fails
    setUser(null);
    clearMonitoringUser();
  }
};
```

## ✅ **Solution 2: Clear Cookies on Logout**

Add cookie clearing to logout:

```javascript
const logout = async () => {
  try {
    await api.post('/auth/logout/');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear user state
    setUser(null);
    clearMonitoringUser();
    
    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Get fresh CSRF token
    await api.get('/csrf/');
  }
};
```

## ✅ **Solution 3: Add Better Error Handling to Login**

Update login to show specific errors:

```javascript
const login = async (username, password) => {
  try {
    // Get fresh CSRF token
    console.log('Getting CSRF token...');
    await api.get('/csrf/');
    console.log('CSRF token obtained');
    
    // Attempt login
    const response = await api.post('/auth/login/', { username, password });
    console.log('Login successful:', response.data);
    
    setUser(response.data.user);
    setMonitoringUser(response.data.user);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    
    // Better error messages
    if (error.response?.status === 401) {
      throw new Error('Invalid username or password');
    } else if (error.response?.status === 403) {
      throw new Error('Security token expired. Please refresh the page.');
    } else {
      throw new Error(error.response?.data?.error || 'Login failed. Please try again.');
    }
  }
};
```

## ✅ **Solution 4: Backend - Auto-Login After Signup**

Update `backend/whitefly/api_views.py` to automatically log in after signup:

```python
@api_view(['POST'])
@permission_classes([AllowAny])
def signup_view(request):
    """Register a new user"""
    serializer = SignUpSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # Auto-login after signup
        login(request, user)
        
        return Response({
            'user': UserSerializer(user).data,
            'message': 'User created successfully'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
```

## 🔧 **Quick Fix to Apply Now**

I'll update your `AuthContext.jsx` with the fix:
